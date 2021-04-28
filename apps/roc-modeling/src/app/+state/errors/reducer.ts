import { createReducer, on } from '@ngrx/store';

import { clearErrorMessage, setErrorMessage } from './actions';
import { initialErrorsState } from './state';


export const errorsReducer = createReducer
  (
    initialErrorsState,

    on(setErrorMessage, (state, { error }) => ({ ...state, error: error })),

    on(clearErrorMessage, (state) => ({ ...state, error: null }))

  );
