import { UserProfileModel } from './models';

export const USER_PROFILE_STORE_FEATURE_KEY = 'userProfile';

export interface UserProfileState
{
  userProfileModel: UserProfileModel;
  error: any;
}

export interface UserProfilePartialState
{
  readonly [USER_PROFILE_STORE_FEATURE_KEY]: UserProfileState;
}

export const initialUserProfileState: UserProfileState =
{
  userProfileModel:
  {
    id: null,
    name: null,
    emailAddress: null,
    hasCurrentInformationBeenInitialized: false
  },
  error: null
};
