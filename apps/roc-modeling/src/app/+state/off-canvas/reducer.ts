import { createReducer, on } from '@ngrx/store';

import { setOffCanvasClosed, setOffCanvasOpen } from './actions';
import { initialOffCanvasState } from './state';


export const offCanvasReducer = createReducer
  (
    initialOffCanvasState,

    on(setOffCanvasOpen, (state) => ({ ...state, isOffCanvasPanelOpened: true })),

    on(setOffCanvasClosed, (state) => ({ ...state, isOffCanvasPanelOpened: false }))

  );
