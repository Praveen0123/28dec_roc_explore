import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UserProfileEffects } from './effects';
import { UserProfileFacadeService } from './facade.service';
import { userProfileReducer } from './reducer';
import { USER_PROFILE_STORE_FEATURE_KEY } from './state';


@NgModule({
  imports:
    [
      CommonModule,
      StoreModule.forFeature
        (
          USER_PROFILE_STORE_FEATURE_KEY,
          userProfileReducer
        ),
      EffectsModule.forFeature([UserProfileEffects])
    ],
  declarations:
    [

    ],
  providers:
    [
      UserProfileFacadeService
    ]
})
export class UserProfileStateModule { }
