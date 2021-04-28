import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { markCurrentInformationAsInitialized, resetUserProfile } from './actions';
import { selectUserProfile } from './selectors';


@Injectable()
export class UserProfileFacadeService
{
  readonly selectUserProfile$ = this.store.pipe(select(selectUserProfile));

  constructor
    (
      private store: Store
    ) { }

  markCurrentInformationAsInitialized(): void
  {
    this.store.dispatch(markCurrentInformationAsInitialized());
  }

  resetUserProfile()
  {
    this.store.dispatch(resetUserProfile());
  }
}
