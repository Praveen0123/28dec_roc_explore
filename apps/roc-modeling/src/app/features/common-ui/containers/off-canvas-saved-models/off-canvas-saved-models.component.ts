import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompareFacadeService } from '@app/+state/compare';
import { OffCanvasFacadeService } from '@app/+state/off-canvas';
import { RoiModelFacadeService } from '@app/+state/roi-model';
import { NotificationService } from '@app/core/services/notification/notification.service';
import { RoiModelDto, RoiModelService } from '@app/domain';
import { DialogConfirmationComponent } from '@app/shared/components/dialog-confirmation/dialog-confirmation.component';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'roc-off-canvas-saved-models',
  templateUrl: './off-canvas-saved-models.component.html',
  styleUrls: ['./off-canvas-saved-models.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffCanvasSavedModelsComponent implements OnInit, OnDestroy
{
  alive: boolean = true;

  roiModelList$: Observable<RoiModelDto[]>;
  compareIdList$: Observable<string[] | number[]>;
  selectedRoiModelId$: Observable<string>;

  constructor
    (
      private compareFacadeService: CompareFacadeService,
      private offCanvasFacadeService: OffCanvasFacadeService,
      private roiModelFacadeService: RoiModelFacadeService,
      private roiModelService: RoiModelService,
      private notificationService: NotificationService,
      private dialog: MatDialog,
      private clipboard: Clipboard
    ) { }

  ngOnInit(): void
  {
    this.roiModelList$ = this.roiModelFacadeService.getRoiModelList$();
    this.compareIdList$ = this.compareFacadeService.getCompareIdList$();
    this.selectedRoiModelId$ = this.roiModelFacadeService.getSelectedRoiModelId$();
  }

  ngOnDestroy()
  {
    this.alive = false;
  }

  onAddNewModel()
  {
    this.roiModelFacadeService.createNewRoiModel();
  }

  onClose()
  {
    this.offCanvasFacadeService.setOffCanvasClosed();
  }

  onMakeActive(roiModelDto: RoiModelDto)
  {
    this.roiModelFacadeService.requestMakeActive(roiModelDto);
  }

  onCompare(isCompare: boolean, roiModelDto: RoiModelDto)
  {
    if (isCompare)
    {
      this.compareFacadeService.addToCompare(roiModelDto);
    }
    else
    {
      this.compareFacadeService.removeRoiAggregateFromCompare(roiModelDto);
    }
  }

  onDelete(roiModelDto: RoiModelDto)
  {
    const message = `Are you sure you want to delete ${roiModelDto.name} model?`;

    const dialogRef = this.dialog.open(DialogConfirmationComponent,
      {
        data: { message: message },
        disableClose: true
      });

    dialogRef
      .afterClosed()
      .pipe
      (
        takeWhile(() => this.alive),
        map((isConfirmed: boolean) =>
        {
          if (isConfirmed)
          {
            this.roiModelFacadeService.deleteRoiModel(roiModelDto);
          }
        })
      )
      .subscribe();

  }

  onCopyRoiAggregateModel()
  {
    const roiSummary: string = this.roiModelService.getRoiAggregateSummary();
    const pending = this.clipboard.beginCopy(roiSummary);
    let remainingAttempts = 3;

    const attempt = () =>
    {
      const result = pending.copy();
      if (!result && --remainingAttempts)
      {
        setTimeout(attempt);
      }
      else
      {
        this.notificationService.success('copy successful');
        // Remember to destroy when you're done!
        pending.destroy();
      }
    };
    attempt();
  }

}
