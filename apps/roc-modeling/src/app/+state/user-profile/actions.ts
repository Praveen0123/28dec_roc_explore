import { createAction } from '@ngrx/store';


export const markCurrentInformationAsInitialized = createAction
  (
    '[UserProfile] mark current information as initialized'
  );

export const resetUserProfile = createAction
  (
    '[UserProfile] reset user profile'
  );
