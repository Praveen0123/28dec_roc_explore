import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { UserProfileModel } from './models';
import { USER_PROFILE_STORE_FEATURE_KEY, UserProfileState } from './state';


// RETRIEVE SLICE OF STATE
export const userProfileSlice: MemoizedSelector<object, UserProfileState> = createFeatureSelector<UserProfileState>(USER_PROFILE_STORE_FEATURE_KEY);


export const selectUserProfile: MemoizedSelector<object, UserProfileModel> = createSelector
  (
    userProfileSlice,
    (state: UserProfileState) => state.userProfileModel
  );

export const hasCurrentInformationBeenInitialized: MemoizedSelector<object, boolean> = createSelector
  (
    userProfileSlice,
    (state: UserProfileState): boolean => state.userProfileModel.hasCurrentInformationBeenInitialized
  );
