import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { DialogDataToKeepModel, EducationFinancingDto, RoiModelDto } from '@app/domain';
import { createAction, props } from '@ngrx/store';



export const loadSelectedRoiModelOrCreateANewOne = createAction
  (
    '[RoiModel] load selected roi model, or create a new one'
  );

export const addRoiModelToStore = createAction
  (
    '[RoiModel] add roiModel',
    props<{ roiModelDto: RoiModelDto; }>()
  );
export const createNewRoiModel = createAction
  (
    '[RoiModel] create new roiModel'
  );




export const processCurrentInformationForm = createAction
  (
    '[RoiModel] process currentt information form',
    props<{ currentInformationForm: CurrentInformationForm; }>()
  );
export const processCareerGoalForm = createAction
  (
    '[RoiModel] process career goal form',
    props<{ careerGoalForm: CareerGoalForm; }>()
  );
export const processEducationCostForm = createAction
  (
    '[RoiModel] process education cost form',
    props<{ educationCostForm: EducationCostForm; }>()
  );
export const processEducationFinancingForm = createAction
  (
    '[RoiModel] process education financing form',
    props<{ educationFinancingForm: EducationFinancingDto; }>()
  );

export const updateRoiModelFromCurrentInformation = createAction
  (
    '[RoiModel] update roi model from current information',
    props<{ roiModelDto: RoiModelDto; }>()
  );
export const updateRoiModelFromCareerGoal = createAction
  (
    '[RoiModel] update roi model from career goal',
    props<{ roiModelDto: RoiModelDto; }>()
  );
export const updateRoiModelFromEducationCost = createAction
  (
    '[RoiModel] update roi model from education cost',
    props<{ roiModelDto: RoiModelDto; }>()
  );
export const updateRoiModelFromEducationFinancing = createAction
  (
    '[RoiModel] update roi model from education financing',
    props<{ roiModelDto: RoiModelDto; }>()
  );



export const deleteRoiModel = createAction
  (
    '[RoiModel] remove roi model',
    props<{ roiModelDto: RoiModelDto; }>()
  );

export const requestMakeActive = createAction
  (
    '[RoiModel] make active',
    props<{ roiModelDto: RoiModelDto; }>()
  );

export const makeActive = createAction
  (
    '[RoiModel] make active',
    props<{ roiModelDto: RoiModelDto; }>()
  );

export const NoopAction = createAction
  (
    '[RoiModel] NoopAction'
  );



export const clearAll = createAction
  (
    '[RoiModel] clear all'
  );

export const cloneRoiModel = createAction
  (
    '[RoiModel] clone roi model',
    props<{ dialogDataToKeepModel: DialogDataToKeepModel; }>()
  );
