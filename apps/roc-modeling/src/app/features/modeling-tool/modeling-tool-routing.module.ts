import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModelingToolComponent } from './containers/modeling-tool/modeling-tool.component';


const routes: Routes =
  [
    {
      path: '',
      component: ModelingToolComponent
    }
  ];

@NgModule({
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class ModelingToolRoutingModule { }
