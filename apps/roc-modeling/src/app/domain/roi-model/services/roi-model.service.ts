import { Injectable } from '@angular/core';
import { Result } from '@vantage-point/ddd-core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { RoiAggregate, RoiModelId } from '../domain';
import { CareerGoalDto, CurrentInformationDto, DialogDataToKeepModel, EducationCostDto, EducationFinancingDto, RoiModelDto } from '../dtos';
import { CreateRoiModelError, RoiModelError, RoiModelMissingError } from '../errors';
import { RoiModelAggregateMapper } from '../mappers/roi-aggregate.mapper';
import { RoiCalculatorOutputModel } from '../models';
import { LifetimeEarningsService } from './lifetime-earnings.service';


@Injectable()
export class RoiModelService
{
  private roiAggregateSubject: BehaviorSubject<RoiAggregate> = new BehaviorSubject<RoiAggregate>(undefined);
  private roiAggregateErrorSubject: BehaviorSubject<RoiModelError> = new BehaviorSubject<RoiModelError>(undefined);
  private roiModelAggregateMapper: RoiModelAggregateMapper = RoiModelAggregateMapper.create();

  public readonly roiModelError$ = this.roiAggregateErrorSubject.asObservable();

  get roiAggregate(): RoiAggregate
  {
    return this.roiAggregateSubject.value;
  }


  constructor
    (
      private lifetimeEarningsService: LifetimeEarningsService
    )
  {
    const emptyRoiAggregateOrError: Result<RoiAggregate> = this.initializeRoiAggregate();

    if (emptyRoiAggregateOrError.isSuccess)
    {
      this.processAggregate(emptyRoiAggregateOrError.getValue());
    }
  }


  createEmptyRoiAggregate(roiModelDto?: RoiModelDto): Promise<RoiModelDto>
  {
    return new Promise((resolve, reject) =>
    {
      try
      {
        this.lifetimeEarningsService.clear();

        if (roiModelDto)
        {
          const roiAggregate: RoiAggregate = this.createRoiAggregateFromDto(roiModelDto);
          resolve(this.processAggregate(roiAggregate));
        }
        else
        {
          resolve(this.toRoiAggregateDto());
        }
      }
      catch (error)
      {
        reject(this.surfaceError('create roi aggregate error', error));
      }
    });
  }

  createEmptyRoiModel(name?: string): Promise<RoiModelDto>
  {
    this.checkIfRoiAggregateExists();

    return new Promise((resolve, reject) =>
    {
      try
      {
        const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

        roiAggregate.createEmptyRoiModel(name);

        resolve(this.processAggregate(roiAggregate));
      }
      catch (error)
      {
        const message: string = `CREATE | ${error.message}`;
        reject(this.surfaceError(message, error));
      }
    });
  }


  updateCurrentInformation(currentInformationDto: CurrentInformationDto): Promise<RoiModelDto>
  {
    this.checkIfRoiAggregateExists();

    return new Promise((resolve, reject) =>
    {
      try
      {
        const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

        roiAggregate.updateCurrentInformation(currentInformationDto);

        resolve(this.processAggregate(roiAggregate));
      }
      catch (error)
      {
        const message: string = `UPDATE CURRENT INFORMATION | ${error.message}`;
        reject(this.surfaceError(message, error));
      }
    });
  }
  updateCareerGoal(careerGoalDto: CareerGoalDto): Promise<RoiModelDto>
  {
    this.checkIfRoiAggregateExists();

    return new Promise((resolve, reject) =>
    {
      try
      {
        const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

        roiAggregate.updateCareerGoal(careerGoalDto);

        resolve(this.processAggregate(roiAggregate));
      }
      catch (error)
      {
        const message: string = `UPDATE CAREER GOAL | ${error.message}`;
        reject(this.surfaceError(message, error));
      }
    });
  }
  updateEducationCost(educationCostDto: EducationCostDto): Promise<RoiModelDto>
  {
    this.checkIfRoiAggregateExists();

    return new Promise((resolve, reject) =>
    {
      try
      {
        const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

        roiAggregate.updateEducationCost(educationCostDto);

        resolve(this.processAggregate(roiAggregate));
      }
      catch (error)
      {
        const message: string = `UPDATE EDUCATION COST | ${error.message}`;
        reject(this.surfaceError(message, error));
      }
    });
  }
  updateEducationFinancing(educationFinancingDto: EducationFinancingDto): Promise<RoiModelDto>
  {
    this.checkIfRoiAggregateExists();

    return new Promise((resolve, reject) =>
    {
      try
      {
        const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

        roiAggregate.updateEducationFinancing(educationFinancingDto);

        resolve(this.processAggregate(roiAggregate));
      }
      catch (error)
      {
        const message: string = `UPDATE EDUCATION FINANCING | ${error.message}`;
        reject(this.surfaceError(message, error));
      }
    });
  }

  makeActive(roiModelDto: RoiModelDto): Promise<RoiModelDto>
  {
    this.checkIfRoiAggregateExists();

    return new Promise((resolve, reject) =>
    {
      try
      {
        const roiModelId: RoiModelId = RoiModelId.create(roiModelDto.id);
        const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

        roiAggregate.makeActive(roiModelId);

        resolve(this.processAggregate(roiAggregate));
      }
      catch (error)
      {
        const message: string = `MAKE ACTIVE | ${error.message}`;
        reject(this.surfaceError(message, error));
      }
    });
  }


  duplicateRoiModel(dialogDataToKeepModel: DialogDataToKeepModel): Promise<RoiModelDto>
  {
    this.checkIfRoiAggregateExists();

    return new Promise((resolve, reject) =>
    {
      try
      {
        const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

        roiAggregate.duplicate(dialogDataToKeepModel);

        resolve(this.processAggregate(roiAggregate));
      }
      catch (error)
      {
        const message: string = `DUPLICATE | ${error.message}`;
        reject(this.surfaceError(message, error));
      }
    });
  }

  deleteRoiModel(roiModelDto: RoiModelDto): Promise<RoiModelDto>
  {
    this.checkIfRoiAggregateExists();

    return new Promise((resolve, reject) =>
    {
      try
      {
        const roiModelId: RoiModelId = RoiModelId.create(roiModelDto.id);
        const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

        roiAggregate.deleteRoiModel(roiModelId);

        resolve(this.processAggregate(roiAggregate));
      }
      catch (error)
      {
        const message: string = `DELETE | ${error.message}`;
        reject(this.surfaceError(message, error));
      }
    });
  }

  clear(): Promise<RoiModelDto>
  {
    this.roiAggregateSubject.next(undefined);
    this.roiAggregateErrorSubject.next(undefined);

    return new Promise((resolve, reject) =>
    {
      try
      {
        const emptyRoiAggregateOrError: Result<RoiAggregate> = this.initializeRoiAggregate();

        if (emptyRoiAggregateOrError.isSuccess)
        {
          resolve(this.processAggregate(emptyRoiAggregateOrError.getValue()));
        }

        reject(emptyRoiAggregateOrError.getError());
      }
      catch (error)
      {
        const message: string = `CLEAR | ${error.message}`;
        reject(this.surfaceError(message, error));
      }
    });
  }


  getRoiList(): Promise<RoiModelDto[]>
  {
    this.checkIfRoiAggregateExists();

    return new Promise((resolve, reject) =>
    {
      try
      {
        const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

        resolve(this.roiModelAggregateMapper.toDTOList(roiAggregate));
      }
      catch (error)
      {
        reject(this.surfaceError('Cannot generate ROI Aggregate List', error));
      }
    });
  }

  getRoiAggregateSummary(): string
  {
    this.checkIfRoiAggregateExists();

    const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

    return JSON.stringify(roiAggregate);
  }





  private initializeRoiAggregate(): Result<RoiAggregate>
  {
    const emptyRoiAggregateOrError: Result<RoiAggregate> = RoiAggregate.create(RoiAggregate.defaultProps);

    return emptyRoiAggregateOrError;
  }

  private processAggregate(roiAggregate: RoiAggregate): RoiModelDto
  {
    this.runCalculator(roiAggregate);

    this.roiAggregateSubject.next(roiAggregate);

    return this.toRoiAggregateDto();
  }

  private toRoiAggregateDto(): RoiModelDto
  {
    try
    {
      const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

      return this.roiModelAggregateMapper.toDTO(roiAggregate);
    }
    catch (error)
    {
      throw CreateRoiModelError.create(error);
    }
  }

  private createRoiAggregateFromDto(roiModelDto: RoiModelDto): RoiAggregate
  {
    try
    {
      const roiModelAggregateOrError: Result<RoiAggregate> = this.roiModelAggregateMapper.toDomain(roiModelDto);

      if (roiModelAggregateOrError.isSuccess)
      {
        return roiModelAggregateOrError.getValue();
      }
      else
      {
        throw roiModelAggregateOrError.getError();
      }
    }
    catch (error)
    {
      throw CreateRoiModelError.create(error);
    }
  }

  private checkIfRoiAggregateExists()
  {
    const roiAggregate: RoiAggregate = this.roiAggregateSubject.value;

    if (roiAggregate === null || roiAggregate === undefined)
    {
      throw RoiModelMissingError.create(`ROI Model does not exist:`);
    }
  }

  private runCalculator(roiAggregate: RoiAggregate): void
  {
    try
    {
      if (roiAggregate)
      {
        // console.log('CALCULATOR | 0.1');

        // CALCULATE ROI INPUT
        roiAggregate.calculateRoiCalculatorInput()
          .then((shouldCalculatorRun: boolean) =>
          {
            // console.log('CALCULATOR | 0.2');

            if (shouldCalculatorRun)
            {
              // RUN CALCULATOR
              this.lifetimeEarningsService.calculate(roiAggregate.roiCalculatorInput)
                .pipe
                (
                  take(1),
                  map((roiCalculatorOutput: RoiCalculatorOutputModel) =>
                  {
                    // console.log('CALCULATOR ** RESULTS ** | 0.3');
                    roiAggregate.updateRoiCalculatorOutput(roiCalculatorOutput);
                  }),
                  catchError((error: any) =>
                  {
                    const details: string = JSON.stringify(roiAggregate.roiCalculatorInput);

                    this.surfaceError(error.message, error, 'CALCUALTOR - 0', details);

                    return of(error);
                  })
                )
                .subscribe();
            }
          });
      }
    }
    catch (error)
    {
      const details: string = JSON.stringify(roiAggregate.roiCalculatorInput);
      this.surfaceError(error.message, error, 'CALCUALTOR - 1', details);
      // console.log('********* ERROR | 1:', error);
    }
  }

  private surfaceError(message: string, error: Error, errorType?: string, details?: string): RoiModelError
  {
    const roiModelError: RoiModelError = RoiModelError.create(message, error, errorType, details);
    this.roiAggregateErrorSubject.next(roiModelError);

    return roiModelError;
  }

}
