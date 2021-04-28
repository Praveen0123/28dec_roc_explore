import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { ERROR_STORE_FEATURE_KEY, ErrorsState } from './state';


// RETRIEVE SLICE OF STATE
export const errorSlice: MemoizedSelector<object, ErrorsState> = createFeatureSelector<ErrorsState>(ERROR_STORE_FEATURE_KEY);


export const errorState: MemoizedSelector<object, ErrorsState> = createSelector
  (
    errorSlice,
    (state: ErrorsState): ErrorsState => state
  );
