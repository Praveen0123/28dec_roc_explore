import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { resetAccordion, setActivePanel, setCareerGoalValidity, setCurrentInformationValidity, setEducationCostValidity } from './actions';
import { selectAccordion } from './selectors';
import { AccordionPanelEnum, AccordionState } from './state';

@Injectable()
export class AccordionFacadeService
{

  constructor
    (
      private store: Store
    ) { }


  setCurrentInformationValidity(isCurrentInformationValid: boolean)
  {
    this.store.dispatch(setCurrentInformationValidity({ isCurrentInformationValid }));
  }

  setCareerGoalValidity(isCareerGoalValid: boolean)
  {
    this.store.dispatch(setCareerGoalValidity({ isCareerGoalValid }));
  }

  setEducationCostValidity(isEducationCostValid: boolean)
  {
    this.store.dispatch(setEducationCostValidity({ isEducationCostValid }));
  }

  setActivePanel(accordionPanel: AccordionPanelEnum)
  {
    this.store.dispatch(setActivePanel({ accordionPanel }));
  }

  resetAccordion()
  {
    this.store.dispatch(resetAccordion());
  }

  getSelectedAccordionModel$(): Observable<AccordionState>
  {
    return this.store.pipe(select(selectAccordion));
  }
}
