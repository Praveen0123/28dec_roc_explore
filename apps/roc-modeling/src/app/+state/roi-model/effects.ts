import { Injectable } from '@angular/core';
import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { CareerGoalDto, CurrentInformationDto, EducationCostDto, LifetimeEarningsService, RoiModelDto, RoiModelService } from '@app/domain';
import { ExchangeAutoCompleteForLocationGQL, ExchangeAutoCompleteForOccupationGQL, InstitutionByUnitIdGQL, InstructionalProgramGQL } from '@gql';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { AutoCompleteModel } from '@vantage-point/auto-complete-textbox';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { setErrorMessage } from '../errors/actions';
import {
  addRoiModelToStore,
  clearAll,
  cloneRoiModel,
  createNewRoiModel,
  deleteRoiModel,
  loadSelectedRoiModelOrCreateANewOne,
  makeActive,
  processCareerGoalForm,
  processCurrentInformationForm,
  processEducationCostForm,
  processEducationFinancingForm,
  requestMakeActive,
  updateRoiModelFromCareerGoal,
  updateRoiModelFromCurrentInformation,
  updateRoiModelFromEducationCost,
  updateRoiModelFromEducationFinancing,
} from './actions';
import { getSelectedCareerGoal, getSelectedRoiModel } from './selectors';



@Injectable()
export class RoiModelStoreEffects
{
  constructor
    (
      private store: Store,
      private actions$: Actions,
      private exchangeAutoCompleteForLocationGQL: ExchangeAutoCompleteForLocationGQL,
      private exchangeAutoCompleteForOccupationGQL: ExchangeAutoCompleteForOccupationGQL,
      private instructionalProgramGQL: InstructionalProgramGQL,
      private institutionByUnitIdGQL: InstitutionByUnitIdGQL,
      private roiModelService: RoiModelService,
      private lifetimeEarningsService: LifetimeEarningsService
    )
  {
  }


  loadSelectedRoiModelOrCreateANewOne$ = createEffect(() => this.actions$.pipe
    (
      ofType(loadSelectedRoiModelOrCreateANewOne),
      withLatestFrom(this.store.pipe(select(getSelectedRoiModel))),
      switchMap(([_, selectedRoiModel]) => this.roiModelService.createEmptyRoiAggregate(selectedRoiModel)),
      map((roiModelDto: RoiModelDto) => addRoiModelToStore({ roiModelDto }))
    ));

  createNewRoiModel$ = createEffect(() => this.actions$.pipe
    (
      ofType(createNewRoiModel),
      switchMap(() => this.roiModelService.createEmptyRoiModel(null)),
      map((roiModelDto) => addRoiModelToStore({ roiModelDto }))
    ));


  processCurrentInformationForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processCurrentInformationForm),
      switchMap((action) =>
      {
        const formData: CurrentInformationForm = action.currentInformationForm;
        const location: AutoCompleteModel = formData?.currentLocation;
        const occupation: AutoCompleteModel = formData?.currentOccupation;

        // console.log('EFFECTS | CAREER GOAL FORM DATA', formData);

        /*
        RETRIEVE LOCATION AND OCCUPATION FROM BACKEND....
        */
        return forkJoin
          (
            {
              location: (location) ? this.exchangeAutoCompleteForLocationGQL.fetch({ autoCompleteModel: location }) : of(null),
              occupation: (occupation) ? this.exchangeAutoCompleteForOccupationGQL.fetch({ autoCompleteModel: occupation }) : of(null)
            }
          )
          .pipe
          (
            switchMap((results) =>
            {
              // console.log('EFFECTS | RESULTS:', results);

              const currentInformation: CurrentInformationDto =
              {
                currentAge: formData.currentAge,
                occupation: (results.occupation) ? results.occupation.data.exchangeAutoCompleteForOccupation : null,
                location: (results.location) ? results.location.data.exchangeAutoCompleteForLocation : null,
                educationLevel: formData.educationLevel
              };

              return this.roiModelService.updateCurrentInformation(currentInformation);
            })
          );
      }),
      map((roiModelDto: RoiModelDto) => updateRoiModelFromCurrentInformation({ roiModelDto })),
      catchError((errorMessage) => of(setErrorMessage({ error: { errorType: 'PROCESS CURRENT INFORMATION', message: errorMessage } })))
    ));
  processCareerGoalForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processCareerGoalForm),
      withLatestFrom(this.store.pipe(select(getSelectedCareerGoal))),
      switchMap(([action, currentCareerGoal]) =>
      {
        const formData: CareerGoalForm = action.careerGoalForm;
        const location: AutoCompleteModel = formData?.location;
        const occupation: AutoCompleteModel = formData?.occupation;
        const cipCode: string = formData?.degreeProgram?.id;

        // console.log('EFFECTS | CAREER GOAL FORM DATA', formData);
        // console.log('EFFECTS | CURRENT CAREER GOAL', currentCareerGoal);

        const hasLocationChanged: boolean = (formData.location?.id !== currentCareerGoal.location?.zipCode);
        const hasOccupationChanged: boolean = (formData.occupation?.id !== currentCareerGoal.occupation?.onetCode);
        const hasProgramChanged: boolean = (formData.degreeProgram?.id !== currentCareerGoal.degreeProgram?.cipCode);

        // console.log('EFFECTS | hasLocationChanged', hasLocationChanged);
        // console.log('EFFECTS | hasOccupationChanged', hasOccupationChanged);
        // console.log('EFFECTS | hasProgramChanged', hasProgramChanged);

        /*
        RETRIEVE LOCATION AND OCCUPATION FROM BACKEND....
        */
        return forkJoin
          (
            {
              location: (location && hasLocationChanged) ? this.exchangeAutoCompleteForLocationGQL.fetch({ autoCompleteModel: location }) : of(null),
              occupation: (occupation && hasOccupationChanged) ? this.exchangeAutoCompleteForOccupationGQL.fetch({ autoCompleteModel: occupation }) : of(null),
              program: (cipCode && hasProgramChanged) ? this.instructionalProgramGQL.fetch({ cipCode: cipCode }) : of(null)
            }
          )
          .pipe
          (
            switchMap((results) =>
            {
              // console.log('RESULTS', results);

              const careerGoal: CareerGoalDto =
              {
                location: (results.location) ? results.location.data.exchangeAutoCompleteForLocation : (!hasLocationChanged) ? currentCareerGoal.location : null,
                occupation: (results.occupation) ? results.occupation.data.exchangeAutoCompleteForOccupation : (!hasOccupationChanged) ? currentCareerGoal.occupation : null,
                degreeLevel: formData.degreeLevel,
                degreeProgram: (results.program) ? results.program.data.instructionalProgram : (!hasProgramChanged) ? currentCareerGoal.degreeProgram : null,
                retirementAge: formData.retirementAge,
                careerGoalPathType: formData.careerGoalPathType
              };

              return this.roiModelService.updateCareerGoal(careerGoal);
            })
          );
      }),
      map((roiModelDto: RoiModelDto) => updateRoiModelFromCareerGoal({ roiModelDto }))
    ));
  processEducationCostForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processEducationCostForm),
      switchMap((action) =>
      {
        const formData: EducationCostForm = action.educationCostForm;
        const institutionId: string = formData?.institution?.id;

        /*
        RETRIEVE INSTITUTION FROM BACKEND....
        */
        return forkJoin
          (
            {
              institution: (institutionId) ? this.institutionByUnitIdGQL.fetch({ unitId: institutionId }) : of(null),
            }
          )
          .pipe
          (
            switchMap((results) =>
            {
              const educationCost: EducationCostDto =
              {
                institution: (results.institution) ? results.institution.data.institution : null,
                startYear: formData.startYear,
                incomeRange: formData.incomeRange,
                isFulltime: formData.isFulltime,
                yearsToCompleteDegree: formData.yearsToCompleteDegree
              };

              return this.roiModelService.updateEducationCost(educationCost);
            })
          );
      }),
      map((roiModelDto: RoiModelDto) => updateRoiModelFromEducationCost({ roiModelDto }))
    ));
  processEducationFinancingForm$ = createEffect(() => this.actions$.pipe
    (
      ofType(processEducationFinancingForm),
      switchMap((action) => this.roiModelService.updateEducationFinancing(action.educationFinancingForm)),
      map((roiModelDto: RoiModelDto) => updateRoiModelFromEducationFinancing({ roiModelDto }))
    ));


  cloneRoiModel$ = createEffect(() => this.actions$.pipe
    (
      ofType(cloneRoiModel),
      switchMap((action) => this.roiModelService.duplicateRoiModel(action.dialogDataToKeepModel)),
      map((roiModelDto: RoiModelDto) => addRoiModelToStore({ roiModelDto }))
    ));

  deleteRoiModel$ = createEffect(() => this.actions$.pipe
    (
      ofType(deleteRoiModel),
      switchMap((action) => this.roiModelService.deleteRoiModel(action.roiModelDto)),
      map((roiModelDto: RoiModelDto) => addRoiModelToStore({ roiModelDto }))
    ));

  clearAll$ = createEffect(() => this.actions$.pipe
    (
      ofType(clearAll),
      switchMap(() => this.roiModelService.clear()),
      map((roiModelDto: RoiModelDto) => addRoiModelToStore({ roiModelDto }))
    ));


  requestMakeActive$ = createEffect(() => this.actions$.pipe
    (
      ofType(requestMakeActive),
      switchMap((action) => this.roiModelService.makeActive(action.roiModelDto)),
      map((roiModelDto: RoiModelDto) =>
      {
        this.lifetimeEarningsService.loadGraph(roiModelDto);

        return makeActive({ roiModelDto });
      })
    ), { dispatch: false });

}
