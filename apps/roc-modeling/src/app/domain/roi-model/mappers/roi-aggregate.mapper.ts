import { IMapper, Result, UniqueEntityID } from '@vantage-point/ddd-core';
import hash from 'object-hash';

import { CareerGoal, CurrentInformation, EducationCost, EducationFinancing, RoiModel } from '../domain';
import { RoiAggregate } from '../domain/roi.aggregate';
import { CareerGoalDto, EducationCostDto, EducationFinancingDto, RoiModelDto } from '../dtos';
import { CareerGoalMapper } from './career-goal.mapper';
import { CurrentInformationMapper } from './current-information.mapper';
import { EducationCostMapper } from './education-cost.mapper';
import { EducationFinancingMapper } from './education-financing.mapper';


export class RoiModelAggregateMapper implements IMapper<RoiAggregate, RoiModelDto>
{

  private constructor()
  {
  }

  public static create(): RoiModelAggregateMapper
  {
    return new RoiModelAggregateMapper();
  }


  toDTO(input: RoiAggregate): RoiModelDto
  {
    return this.toRoiModelDto(input.currentInformation, input.activeRoiModel);
  }

  toDTOList(input: RoiAggregate): RoiModelDto[]
  {
    const list: RoiModelDto[] = [];

    input.roiModelList.map((item: RoiModel) =>
    {
      const roiModelDto: RoiModelDto = this.toRoiModelDto(input.currentInformation, item);
      list.push(roiModelDto);
    });

    return list;
  }

  toDomain(input: RoiModelDto): Result<RoiAggregate>
  {
    const currentInformationOrError: Result<CurrentInformation> = CurrentInformationMapper.create().toDomain(input.currentInformation);
    const careerGoalOrError: Result<CareerGoal> = CareerGoalMapper.create().toDomain(input.careerGoal);
    const educationCostOrError: Result<EducationCost> = EducationCostMapper.create().toDomain(input.educationCost);
    const educationFinancingOrError: Result<EducationFinancing> = EducationFinancingMapper.create().toDomain(input.educationFinancing);

    const roiModelOrError: Result<RoiModel> = RoiModel.create
      (
        {
          name: input.name,
          careerGoal: careerGoalOrError.isSuccess ? careerGoalOrError.getValue() : null,
          educationCost: educationCostOrError.isSuccess ? educationCostOrError.getValue() : null,
          educationCostRefinement: null,
          educationFinancing: educationFinancingOrError.isSuccess ? educationFinancingOrError.getValue() : null,
          radiusInMiles: input?.radiusInMiles ?? null,
          dateCreated: input.dateCreated ?? null,
          lastUpdated: input.lastUpdated ?? null
        },
        UniqueEntityID.create(input.id)
      );

    if (currentInformationOrError.isSuccess && roiModelOrError.isSuccess)
    {
      const currentInformation: CurrentInformation = currentInformationOrError.getValue();
      const roiModel: RoiModel = roiModelOrError.getValue();

      return RoiAggregate.create
        (
          {
            currentInformation: currentInformation,
            roiModel: roiModel
          }
        );
    }

    if (currentInformationOrError.isFailure)
    {
      throw currentInformationOrError.getError();
    }

    if (roiModelOrError.isFailure)
    {
      throw roiModelOrError.getError();
    }
  }


  private toRoiModelDto(currentInformation: CurrentInformation, roiModel: RoiModel): RoiModelDto
  {

    const careerGoal: CareerGoalDto = (roiModel.careerGoal) ? CareerGoalMapper.create().toDTO(roiModel.careerGoal) : null;
    const educationCost: EducationCostDto = (roiModel.educationCost) ? EducationCostMapper.create().toDTO(roiModel.educationCost) : null;
    const educationFinancing: EducationFinancingDto = (roiModel.educationFinancing) ? EducationFinancingMapper.create().toDTO(roiModel.educationFinancing) : null;

    const isCurrentInformationDefault: boolean = (hash(CurrentInformation.defaultProps) === hash(currentInformation?.props));
    const isCareerGoalDefault: boolean = (hash(CareerGoal.defaultProps) === hash(roiModel.careerGoal?.props));
    const isEducationCostDefault: boolean = (hash(EducationCost.defaultProps) === hash(roiModel.educationCost?.props));
    const isEducationFinancingDefault: boolean = (hash(EducationFinancing.defaultProps) === hash(roiModel.educationFinancing?.props));

    const loanLimitsInfo = roiModel.getLoanLimitsInfo();

    const roiModelDto: RoiModelDto =
    {
      id: roiModel.roiModelId.id.toString(),
      name: roiModel.name,
      currentInformation: currentInformation,

      careerGoal: careerGoal,
      educationCost: educationCost,
      educationCostRefinement: null,
      educationFinancing: educationFinancing,
      roiCalculatorInput: roiModel.roiCalculatorInput,
      roiCalculatorInputHash: roiModel.hash,
      roiCalculatorOutput: roiModel.roiCalculatorOutput,
      radiusInMiles: roiModel.radiusInMiles,
      dateCreated: roiModel.dateCreated,
      lastUpdated: roiModel.lastUpdated,

      costOfAttendanceByYear: roiModel.getCostOfAttendanceByYear(currentInformation),
      grantOrScholarshipAidExcludingPellGrant: roiModel.getGrantOrScholarshipAidExcludingPellGrant(),
      efc: roiModel.getEfc(),
      netPriceByYear: roiModel.getNetPriceByYear(currentInformation),
      federalSubsidizedLoanLimitByYear: loanLimitsInfo.federalSubsidizedLoanByYear,
      federalUnsubsidizedLoanLimitByYear: loanLimitsInfo.federalUnsubsidizedLoanByYear,
      outOfPocketExpensesByYear: roiModel.getOutOfPocketExpensesByYear(currentInformation),

      isDefaultModel: (isCurrentInformationDefault && isCareerGoalDefault && isEducationCostDefault && isEducationFinancingDefault),
      isReadyForCompare: false
    };

    return roiModelDto;

  }
}
