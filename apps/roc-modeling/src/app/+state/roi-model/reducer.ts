import { createReducer, on } from '@ngrx/store';

import { addRoiModelToStore, clearAll, deleteRoiModel, makeActive, updateRoiModelFromCareerGoal, updateRoiModelFromCurrentInformation, updateRoiModelFromEducationCost, updateRoiModelFromEducationFinancing } from './actions';
import { initialRoiModelStoreState, roiModelStateAdapter } from './state';


export const reducer = createReducer
  (
    initialRoiModelStoreState,

    on(addRoiModelToStore, (state, { roiModelDto }) =>
    {
      if (roiModelDto)
      {
        return roiModelStateAdapter.addOne(roiModelDto, { ...state, selectedRoiModelId: roiModelDto.id });
      }

      return { ...state };
    }),

    on
      (
        updateRoiModelFromCurrentInformation,
        updateRoiModelFromCareerGoal,
        updateRoiModelFromEducationCost,
        updateRoiModelFromEducationFinancing,
        (state, { roiModelDto }) => roiModelStateAdapter.upsertOne(roiModelDto, { ...state, selectedRoiModelId: roiModelDto.id })),

    on(deleteRoiModel, (state, { roiModelDto }) => roiModelStateAdapter.removeOne(roiModelDto.id, { ...state })),

    on(makeActive, (state, { roiModelDto }) => ({ ...state, selectedRoiModelId: roiModelDto.id })),

    on(clearAll, (state) => roiModelStateAdapter.removeAll({ ...state, selectedRoiModelId: null }))
  );
