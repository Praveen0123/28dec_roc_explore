import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RoiModelFacadeService } from '@app/+state/roi-model';


@Injectable({
  providedIn: 'root'
})
export class HomeResolverService implements Resolve<void>
{
  constructor
    (
      private roiModelFacadeService: RoiModelFacadeService
    ) { }

  resolve()
  {
    this.roiModelFacadeService.loadSelectedRoiModelOrCreateANewOne();
  }
}
