import { AggregateRoot, Guard, Result, UniqueEntityID } from '@vantage-point/ddd-core';

import { CareerGoalDto, CurrentInformationDto, DialogDataToKeepModel, EducationCostDto, EducationFinancingDto } from '../dtos';
import { RoiModelMissingError } from '../errors';
import { CurrentInformationMapper } from '../mappers/current-information.mapper';
import { RoiCalculatorInput, RoiCalculatorOutputModel } from '../models';
import { CurrentInformation } from './current-information.model';
import { RoiAggregateId } from './roi-aggregate-id';
import { RoiModel, RoiModelProps } from './roi-model';
import { RoiModelId } from './roi-model-id';


interface RoiAggregateProps
{
  currentInformation?: CurrentInformation;
  roiModel?: RoiModel;
}


export class RoiAggregate extends AggregateRoot<RoiAggregateProps>
{
  private _roiAggregateIdId: RoiAggregateId;
  private _activeRoiModelId: RoiModelId;
  private store: Map<string, RoiModel> = new Map();


  get currentInformation(): CurrentInformation
  {
    return this.props.currentInformation;
  }
  get name(): string
  {
    return this.activeRoiModel.name;
  }
  get activeRoiModel(): RoiModel
  {
    const key: string = this._activeRoiModelId.id.toString();

    if (this.store.has(key))
    {
      return this.store.get(key);
    }

    throw RoiModelMissingError.create('MISSING ROI MODEL');
  }
  get roiCalculatorInput(): RoiCalculatorInput
  {
    return this.activeRoiModel.roiCalculatorInput;
  }
  get roiModelList(): RoiModel[]
  {
    return Array.from(this.store.values());
  }


  private constructor(props: RoiAggregateProps, id?: UniqueEntityID)
  {
    super(props, id);

    this._roiAggregateIdId = RoiAggregateId.create(this._id);
    this.addRoiModelToStore(props.roiModel);
  }

  static create(props: RoiAggregateProps, id?: UniqueEntityID): Result<RoiAggregate>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk(
      [
      ]);

    if (!propsResult.succeeded)
    {
      return Result.failure<RoiAggregate>(propsResult.message || 'roi model properties error');
    }

    const roiModelAggregate = new RoiAggregate
      (
        {
          ...props,
          roiModel: props.roiModel
        },
        id
      );

    return Result.success<RoiAggregate>(roiModelAggregate);
  }

  static get defaultProps(): RoiAggregateProps
  {
    const currentInformationOrError: Result<CurrentInformation> = CurrentInformation.create(CurrentInformation.defaultProps);
    const roiModelOrError: Result<RoiModel> = RoiModel.create(RoiModel.defaultProps);

    if (currentInformationOrError.isSuccess && roiModelOrError.isSuccess)
    {
      const props: RoiAggregateProps =
      {
        currentInformation: currentInformationOrError.getValue(),
        roiModel: roiModelOrError.getValue()
      };

      return props;
    }

    return {
      currentInformation: null,
      roiModel: null
    };
  }


  createEmptyRoiModel(name?: string): void
  {
    const roiModelProps: RoiModelProps = RoiModel.defaultProps;
    roiModelProps.name = name ?? this.getDefaultModelName();

    const roiModelOrError: Result<RoiModel> = RoiModel.create(roiModelProps);

    if (roiModelOrError.isSuccess)
    {
      this.addRoiModelToStore(roiModelOrError.getValue());
    }
    else
    {
      throw roiModelOrError.getError();
    }
  }
  duplicate(dialogDataToKeepModel: DialogDataToKeepModel): void
  {
    const dupliciateOrFailure: Result<RoiModel> = RoiModel.create
      (
        this.activeRoiModel.props,
        RoiModelId.create().id
      );

    if (dupliciateOrFailure.isSuccess)
    {
      const duplicateRoiModel: RoiModel = dupliciateOrFailure.getValue();

      // UPDATE MODEL NAME
      duplicateRoiModel.updateRoiModelName(dialogDataToKeepModel.modelName);


      /* #region  CAREER GOAL  */

      if (!dialogDataToKeepModel.isGoalLocationSaved)
      {
        duplicateRoiModel.clearCareerGoalLocation();
      }

      if (!dialogDataToKeepModel.isGoalOccupationSaved)
      {
        duplicateRoiModel.clearCareerGoalOccupation();
      }

      if (!dialogDataToKeepModel.isGoalDegreeLevelSaved)
      {
        duplicateRoiModel.clearCareerGoalDegreeLevel();
      }

      if (!dialogDataToKeepModel.isGoalDegreeProgramSaved)
      {
        duplicateRoiModel.clearCareerGoalDegreeProgram();
      }

      if (!dialogDataToKeepModel.isGoalRetirementAgeSaved)
      {
        duplicateRoiModel.clearCareerGoalRetirementAge();
      }

      /* #endregion */


      /* #region  EDUCATION COSTS */

      if (!dialogDataToKeepModel.isEducationCostInstitutionSaved)
      {
        duplicateRoiModel.clearEducationCostInstitution();
      }

      if (!dialogDataToKeepModel.isEducationCostStartSchoolSaved)
      {
        duplicateRoiModel.clearEducationCostStartSchoolYear();
      }

      if (!dialogDataToKeepModel.isEducationCostPartTimeFullTimeSaved)
      {
        duplicateRoiModel.clearEducationCostPartTimeFullTime();
      }

      if (!dialogDataToKeepModel.isEducationCostYearsToCompleteSaved)
      {
        duplicateRoiModel.clearEducationCostYearsToComplete();
      }

      /* #endregion */


      this.addRoiModelToStore(duplicateRoiModel);
    }
  }
  makeActive(roiModelId: RoiModelId): void
  {
    const key: string = roiModelId.id.toString();

    if (this.store.has(key))
    {
      this._activeRoiModelId = roiModelId;
    }
    else
    {
      const message: string = `ROI Model (${key}) does not exist`;
      throw RoiModelMissingError.create(message);
    }
  }
  deleteRoiModel(roiModelId: RoiModelId): void
  {
    const key: string = roiModelId.id.toString();
    const activeKey: string = this._activeRoiModelId.id.toString();

    if (this.store.has(key))
    {
      this.store.delete(key);

      // IF STORE IS EMPTY, CREATE A NEW ROI MODEL
      if (this.store.size === 0)
      {
        this.createEmptyRoiModel();
      }

      // IF MODEL BEING DELETED IS ACTIVE MODEL, THEN FIND NEW ACTIVE
      else if (key === activeKey)
      {
        const nextRoiModel: RoiModel = this.roiModelList[0];

        this._activeRoiModelId = nextRoiModel.roiModelId;
      }
    }
  }
  updateRoiModelName(name: string)
  {
    this.activeRoiModel.updateRoiModelName(name);
  }

  toJSON = () =>
  {
    return {
      id: this._roiAggregateIdId.id.toValue(),
      activeRoiModelId: this._activeRoiModelId.id.toValue(),
      currentInformation: this.currentInformation,
      roiModelList: this.roiModelList
    };
  };



  /* #region  CURRENT INFORMATION */

  updateCurrentInformation(currentInformationDto: CurrentInformationDto): void
  {
    const successOrError: Result<CurrentInformation> = CurrentInformationMapper.create().toDomain(currentInformationDto);

    if (successOrError.isSuccess)
    {
      this.props.currentInformation = successOrError.getValue();
    }
    else
    {
      throw successOrError.getError();
    }
  }

  /* #endregion */



  /* #region  CAREER GOAL */

  updateCareerGoal(careerGoalDto: CareerGoalDto): void
  {
    this.activeRoiModel.updateCareerGoal(careerGoalDto);
  }

  /* #endregion */



  /* #region  EDUCATION COST */

  updateEducationCost(educationCostDto: EducationCostDto): void
  {
    this.activeRoiModel.updateEducationCost(educationCostDto, this.props.currentInformation);
  }

  /* #endregion */



  /* #region  EDUCATION FINANCING */

  updateEducationFinancing(educationFinancingDto: EducationFinancingDto): void
  {
    this.activeRoiModel.updateEducationFinancing(educationFinancingDto);
  }

  /* #endregion */



  /* #region  INPUT/OUTPUT */


  calculateRoiCalculatorInput(): Promise<boolean>
  {
    return this.activeRoiModel.calculateRoiCalculatorInput(this.props.currentInformation).then((shouldCalculatorRun: boolean) =>
    {
      if (!this.props.currentInformation.isValid())
      {
        return false;
      }

      return shouldCalculatorRun;
    });
  }
  updateRoiCalculatorOutput(roiCalculatorOutput: RoiCalculatorOutputModel): void
  {
    this.activeRoiModel.updateRoiCalculatorOutput(roiCalculatorOutput);
  }


  /* #endregion */




  private addRoiModelToStore(roiModel: RoiModel): void
  {
    const key: string = roiModel.roiModelId.id.toString();

    this._activeRoiModelId = roiModel.roiModelId;
    this.store.set(key, roiModel);
  }

  private getDefaultModelName(): string
  {
    const defaultRoiModelCount: number = this.getCountOfDefaultModels();
    return `${RoiModel.defaultProps.name} ${defaultRoiModelCount + 1}`;
  }

  private getCountOfDefaultModels(): number
  {
    let maxNumber: number = 0;

    for (let roiModel of this.store.values())
    {
      if (roiModel.name.startsWith(RoiModel.defaultProps.name))
      {
        const ordinalFromName: string = roiModel.name.replace(RoiModel.defaultProps.name, '').trim();
        const ordinal: number = (ordinalFromName.length === 0) ? 0 : parseInt(ordinalFromName);

        maxNumber = (ordinal > maxNumber) ? ordinal : maxNumber;
      }
    }

    return maxNumber;
  }

}
