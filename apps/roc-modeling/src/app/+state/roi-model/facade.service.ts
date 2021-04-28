import { Injectable } from '@angular/core';
import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { DialogDataToKeepModel, EducationFinancingDto, RoiModelDto } from '@app/domain';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  clearAll,
  cloneRoiModel,
  createNewRoiModel,
  deleteRoiModel,
  loadSelectedRoiModelOrCreateANewOne,
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
import { getRoiModelCount, getRoiModelIdList, getRoiModelList, getSelectedRoiModel, getSelectedRoiModelId } from './selectors';


@Injectable({
  providedIn: 'root'
})
export class RoiModelFacadeService
{

  constructor
    (
      private store: Store
    )
  {
  }

  loadSelectedRoiModelOrCreateANewOne()
  {
    return this.store.dispatch(loadSelectedRoiModelOrCreateANewOne());
  }

  createNewRoiModel()
  {
    return this.store.dispatch(createNewRoiModel());
  }


  updateRoiModelFromCurrentInformation(roiModelDto: RoiModelDto)
  {
    return this.store.dispatch(updateRoiModelFromCurrentInformation({ roiModelDto }));
  }
  updateRoiModelFromCareerGoal(roiModelDto: RoiModelDto)
  {
    return this.store.dispatch(updateRoiModelFromCareerGoal({ roiModelDto }));
  }
  updateRoiModelFromEducationCost(roiModelDto: RoiModelDto)
  {
    return this.store.dispatch(updateRoiModelFromEducationCost({ roiModelDto }));
  }
  updateRoiModelFromEducationFinancing(roiModelDto: RoiModelDto)
  {
    return this.store.dispatch(updateRoiModelFromEducationFinancing({ roiModelDto }));
  }


  cloneRoiModel(dialogDataToKeepModel: DialogDataToKeepModel)
  {
    return this.store.dispatch(cloneRoiModel({ dialogDataToKeepModel }));
  }


  deleteRoiModel(roiModelDto: RoiModelDto)
  {
    return this.store.dispatch(deleteRoiModel({ roiModelDto }));
  }

  requestMakeActive(roiModelDto: RoiModelDto)
  {
    return this.store.dispatch(requestMakeActive({ roiModelDto }));
  }


  getRoiModelList$(): Observable<RoiModelDto[]>
  {
    return this.store.pipe(select(getRoiModelList));
  }

  getSelectedRoiModel$(): Observable<RoiModelDto>
  {
    return this.store.pipe(select(getSelectedRoiModel));
  }
  getSelectedRoiModelId$(): Observable<string>
  {
    return this.store.pipe(select(getSelectedRoiModelId));
  }


  processCurrentInformationForm(currentInformationForm: CurrentInformationForm): void
  {
    this.store.dispatch(processCurrentInformationForm({ currentInformationForm }));
  }
  processCareerGoalForm(careerGoalForm: CareerGoalForm): void
  {
    this.store.dispatch(processCareerGoalForm({ careerGoalForm }));
  }
  processEducationCostForm(educationCostForm: EducationCostForm): void
  {
    this.store.dispatch(processEducationCostForm({ educationCostForm }));
  }
  processEducationFinancingForm(educationFinancingForm: EducationFinancingDto): void
  {
    this.store.dispatch(processEducationFinancingForm({ educationFinancingForm }));
  }


  clearAll()
  {
    return this.store.dispatch(clearAll());
  }

  getRoiModelIdList$(): Observable<string[] | number[]>
  {
    return this.store.pipe(select(getRoiModelIdList));
  }

  getRoiModelCount$(): Observable<number>
  {
    return this.store.pipe(select(getRoiModelCount));
  }

}
