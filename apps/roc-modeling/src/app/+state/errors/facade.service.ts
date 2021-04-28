import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { clearErrorMessage, setErrorMessage } from './actions';
import { errorState } from './selectors';
import { ErrorsState } from './state';

@Injectable()
export class ErrorsFacadeService
{

  constructor
    (
      private store: Store
    ) { }


  setErrorMessage(error: any)
  {
    this.store.dispatch(setErrorMessage(error));
  }

  clearErrorMessage()
  {
    this.store.dispatch(clearErrorMessage());
  }

  getErrorState$(): Observable<ErrorsState>
  {
    return this.store.pipe(select(errorState));
  }
}
