import { createAction, props } from '@ngrx/store';

import { ErrorsState } from './state';


export const setErrorMessage = createAction
  (
    '[Errors] set error message',
    props<{ error: ErrorsState; }>()
  );

export const clearErrorMessage = createAction
  (
    '[Errors] cear error message'
  );
