import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from '@env/environment';
import { storageSync } from '@larscom/ngrx-store-storagesync';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, RouterReducerState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ACCORDION_STORE_FEATURE_KEY } from './accordion/state';
import { AccordionStateModule } from './accordion/store.module';
import { COMPARE_STORE_FEATURE_KEY } from './compare/state';
import { CompareStoreModule } from './compare/store.module';
import { ErrorsStateModule } from './errors/store.module';
import { OFF_CANVAS_STORE_FEATURE_KEY } from './off-canvas/state';
import { OffCanvasStateModule } from './off-canvas/store.module';
import { ROI_MODEL_STORE_FEATURE_KEY } from './roi-model/state';
import { RoiModelStoreModule } from './roi-model/store.module';
import { userProfileReducer } from './user-profile/reducer';
import { USER_PROFILE_STORE_FEATURE_KEY, UserProfilePartialState } from './user-profile/state';
import { UserProfileStateModule } from './user-profile/store.module';

// Root State - extend all partial states
export interface IRootState extends UserProfilePartialState
{
  router: RouterReducerState;
}

// Map root state's properties (partial states) to their reducers
export const reducers: ActionReducerMap<IRootState> =
{
  router: routerReducer,
  [USER_PROFILE_STORE_FEATURE_KEY]: userProfileReducer,
};

// Create a store meta reducer to allow caching in browser
export function storageSyncReducer(reducer: ActionReducer<IRootState>): any
{
  // provide all feature states within the features array
  // features which are not provided, do not get synced
  const metaReducer = storageSync(
    {
      features:
        [
          // save only router state to sessionStorage
          { stateKey: 'router', storageForFeature: window.sessionStorage },
          { stateKey: ACCORDION_STORE_FEATURE_KEY },
          { stateKey: COMPARE_STORE_FEATURE_KEY },
          { stateKey: OFF_CANVAS_STORE_FEATURE_KEY },
          { stateKey: ROI_MODEL_STORE_FEATURE_KEY },
          { stateKey: USER_PROFILE_STORE_FEATURE_KEY },
          // exclude key 'success' inside 'auth' and all keys 'loading' inside 'feature1'
          { stateKey: 'feature1', excludeKeys: ['auth.success', 'loading'] },
        ],
      storage: window.sessionStorage,
    });

  return metaReducer(reducer);
}

@NgModule({
  declarations:
    [
    ],
  imports:
    [
      CommonModule,
      StoreModule.forRoot
        (
          reducers,
          {
            metaReducers: typeof window !== 'undefined' ? [storageSyncReducer] : [],
            runtimeChecks: {
              strictActionImmutability: true,
              strictStateImmutability: true,
            },
          }
        ),
      EffectsModule.forRoot([]),
      StoreRouterConnectingModule.forRoot(),
      StoreDevtoolsModule.instrument
        (
          {
            maxAge: 25,
            logOnly: environment.production,
          }
        )
    ],
  exports:
    [
      AccordionStateModule,
      CompareStoreModule,
      ErrorsStateModule,
      OffCanvasStateModule,
      RoiModelStoreModule,
      UserProfileStateModule
    ],
})
export class RootStoreModule { }
