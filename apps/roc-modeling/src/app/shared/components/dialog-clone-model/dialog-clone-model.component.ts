import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CareerGoalDto, DialogDataToKeepModel, EducationCostDto, RoiModelDto } from '@app/domain';
import { CareerGoal, EducationCost } from '@app/domain/roi-model/domain';


@Component({
  selector: 'roc-dialog-clone-model',
  templateUrl: './dialog-clone-model.component.html',
  styleUrls: ['./dialog-clone-model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogCloneModelComponent implements OnInit
{
  formGroup: FormGroup;
  careerGoal: CareerGoalDto;
  educaionCost: EducationCostDto;

  changeMapCareerGoal: Map<string, boolean> = new Map();
  changeMapEducation: Map<string, boolean> = new Map();

  hasCareerGoalChangedFromDefault: boolean = true;
  hasEducationChangedFromDefault: boolean = true;


  constructor
    (
      private formBuilder: FormBuilder,
      private dialogRef: MatDialogRef<DialogCloneModelComponent>,
      @Inject(MAT_DIALOG_DATA) private data: RoiModelDto
    ) { }

  ngOnInit(): void
  {
    this.buildForm();
    this.careerGoal = this.data.careerGoal;
    this.educaionCost = this.data.educationCost;


    this.changeMapCareerGoal.set('location', (this.careerGoal.location !== CareerGoal.defaultProps.location));
    this.changeMapCareerGoal.set('occupation', (this.careerGoal.occupation !== CareerGoal.defaultProps.occupation));
    this.changeMapCareerGoal.set('degreeLevel', (this.careerGoal.degreeLevel !== CareerGoal.defaultProps.degreeLevel));
    this.changeMapCareerGoal.set('degreeProgram', (this.careerGoal.degreeProgram !== CareerGoal.defaultProps.degreeProgram));
    this.changeMapCareerGoal.set('retirementAge', (this.careerGoal.retirementAge !== CareerGoal.defaultProps.retirementAge));
    this.hasCareerGoalChangedFromDefault = Array.from(this.changeMapCareerGoal.values()).includes(true);

    // console.log('careerGoal', this.careerGoal);
    // console.log('career goal defaults', CareerGoal.defaultProps);
    // console.log('changeMap career goal', this.changeMapCareerGoal);
    // console.log('changeMap career goal', this.hasCareerGoalChangedFromDefault);



    this.changeMapEducation.set('institution', (this.educaionCost.institution !== EducationCost.defaultProps.institution));
    this.changeMapEducation.set('startYear', (this.educaionCost.startYear !== EducationCost.defaultProps.startYear));
    this.changeMapEducation.set('isFulltime', (this.educaionCost.isFulltime !== EducationCost.defaultProps.isFulltime));
    this.changeMapEducation.set('yearsToCompleteDegree', (this.educaionCost.yearsToCompleteDegree !== EducationCost.defaultProps.yearsToCompleteDegree));
    this.hasEducationChangedFromDefault = Array.from(this.changeMapEducation.values()).includes(true);

    // console.log('educaionCost', this.educaionCost);
    // console.log('education defaults', EducationCost.defaultProps);
    // console.log('changeMap education', this.changeMapEducation);
    // console.log('changeMap education', this.hasEducationChangedFromDefault);
  }

  onCancelClick(): void
  {
    this.dialogRef.close();
  }

  onSaveClick(): void
  {
    const dialogModel: DialogDataToKeepModel =
    {
      modelName: this.formGroup.controls.modelName.value,
      isGoalLocationSaved: this.formGroup.controls.isLocationSaved.value,
      isGoalOccupationSaved: this.formGroup.controls.isOccupationSaved.value,
      isGoalDegreeLevelSaved: this.formGroup.controls.isDegreeLevelSaved.value,
      isGoalDegreeProgramSaved: this.formGroup.controls.isDegreeProgramSaved.value,
      isGoalRetirementAgeSaved: this.formGroup.controls.isRetirementAgeSaved.value,
      isEducationCostInstitutionSaved: this.formGroup.controls.isInstitutionSaved.value,
      isEducationCostStartSchoolSaved: this.formGroup.controls.isStartSchoolSaved.value,
      isEducationCostPartTimeFullTimeSaved: this.formGroup.controls.isPartTimeFullTimeSaved.value,
      isEducationCostYearsToCompleteSaved: this.formGroup.controls.isYearsToCompleteSaved.value,
    };

    this.dialogRef.close(dialogModel);
  }



  private buildForm()
  {
    this.formGroup = this.formBuilder.group
      ({
        modelName: new FormControl('', [Validators.required]),
        isLocationSaved: new FormControl(true),
        isOccupationSaved: new FormControl(true),
        isDegreeLevelSaved: new FormControl(true),
        isDegreeProgramSaved: new FormControl(true),
        isRetirementAgeSaved: new FormControl(true),
        isInstitutionSaved: new FormControl(true),
        isStartSchoolSaved: new FormControl(true),
        isPartTimeFullTimeSaved: new FormControl(true),
        isYearsToCompleteSaved: new FormControl(true)
      });
  }


}
