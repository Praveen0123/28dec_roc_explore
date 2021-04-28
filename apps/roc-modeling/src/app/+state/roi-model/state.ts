import { RoiModelDto } from '@app/domain';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';


export const ROI_MODEL_STORE_FEATURE_KEY = 'roi-model-store';

export interface RoiModelStoreState extends EntityState<RoiModelDto>
{
  selectedRoiModelId: string;
}

export const roiModelStateAdapter: EntityAdapter<RoiModelDto> = createEntityAdapter<RoiModelDto>
  (
    {
      selectId: (roiModel: RoiModelDto) => roiModel.id,
      sortComparer: false
    }
  );

export const initialRoiModelStoreState: RoiModelStoreState = roiModelStateAdapter.getInitialState
  (
    {
      selectedRoiModelId: null
    }
  );

export const
  {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = roiModelStateAdapter.getSelectors();
