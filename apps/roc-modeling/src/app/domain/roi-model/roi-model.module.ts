import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LifetimeEarningsService, RoiModelService } from './services';
import { RoiModelAnalysisService } from './services/roi-model-analysis.service';

@NgModule({
  imports:
    [
      CommonModule
    ],
  declarations:
    [
    ],
  exports:
    [
    ],
  providers:
    [
      LifetimeEarningsService,
      RoiModelAnalysisService,
      RoiModelService
    ]
})
export class RoiModelModule { }
