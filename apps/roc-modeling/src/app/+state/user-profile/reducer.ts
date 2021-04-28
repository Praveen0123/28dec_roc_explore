import { createReducer, on } from '@ngrx/store';

import { markCurrentInformationAsInitialized, resetUserProfile } from './actions';
import { initialUserProfileState } from './state';



export const userProfileReducer = createReducer
  (
    initialUserProfileState,


    on(markCurrentInformationAsInitialized, (state) =>
    {
      return {
        ...state, userProfileModel:
        {
          ...state.userProfileModel,
          hasCurrentInformationBeenInitialized: true
        }
      };
    }),


    on(resetUserProfile, () =>
    {
      return { ...initialUserProfileState };
    }),


  );
