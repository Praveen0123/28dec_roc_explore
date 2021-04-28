import { Injectable } from '@angular/core';
import { CareerGoalDto, EducationCostDto, RoiModelDto } from '@app/domain';
import { RoiModelAnalysisService } from '@app/domain/roi-model/services/roi-model-analysis.service';
import { Institution } from '@gql';

import { CompareModel } from './state';


@Injectable({
  providedIn: 'root'
})
export class CompareService
{

  constructor
    (
      private roiModelAnalysisService: RoiModelAnalysisService
    )
  {
  }

  toCompareModel(input: RoiModelDto): CompareModel
  {
    const careerGoal: CareerGoalDto = input.careerGoal;
    const educationCost: EducationCostDto = input.educationCost;
    const institution: Institution = educationCost.institution;

    const institutionAddress: string = (institution) ? `${institution.city}, ${institution.stateAbbr}  ${institution.zipCode}` : null;

    const compareModel: CompareModel =
    {
      roiModelId: input.id,
      goalCareerName: careerGoal.occupation?.title ?? null,
      goalLocationCity: careerGoal.location?.cityName ?? null,
      goalLocationState: careerGoal.location?.stateAbbreviation ?? null,
      goalRetirementAge: careerGoal.retirementAge,
      goalBeginningAcademicYear: educationCost.startYear,
      goalDegreeName: careerGoal.degreeProgram?.cipTitle ?? null,

      institutionName: institution?.name ?? null,
      institutionAddress: institutionAddress,
      institutionWebsite: institution?.url ?? null,
      institutionType: institution?.levelTypeName ?? null,
      institutionGraduationRate: this.roiModelAnalysisService.getGraduationRate(),
      institutionUndergraduateStudentCount: institution?.studentBody?.totalCount ?? null,

      scoresSATReadingMinimum: this.roiModelAnalysisService.getMinimumScoresByType('SAT', 'READING'),
      scoresSATReadingMaximum: this.roiModelAnalysisService.getMaximumScoresByType('SAT', 'READING'),
      scoresSATMathMinimum: this.roiModelAnalysisService.getMinimumScoresByType('SAT', 'READING'),
      scoresSATMathMaximum: this.roiModelAnalysisService.getMaximumScoresByType('SAT', 'READING'),
      scoresACTReadingMinimum: this.roiModelAnalysisService.getMinimumScoresByType('ACT', 'READING'),
      scoresACTReadingMaximum: this.roiModelAnalysisService.getMaximumScoresByType('ACT', 'READING'),
      scoresACTMathMinimum: this.roiModelAnalysisService.getMinimumScoresByType('ACT', 'READING'),
      scoresACTMathMaximum: this.roiModelAnalysisService.getMaximumScoresByType('ACT', 'READING'),
      scoresAcceptanceRate: institution?.admissionRate ?? null,

      educationNetPrice: this.roiModelAnalysisService.getNetPrice(),
      educationFederalLoanAmount: this.roiModelAnalysisService.getFederalLoanAmount(),
      educationPrivateLoanAmount: this.roiModelAnalysisService.getPrivateLoanAmount(),
      educationOutOfPocketCost: this.roiModelAnalysisService.getOutOfPocketExpensesAmount(),
      educationLoanDefaultRate: null,

      earningsAverageSalary: careerGoal.occupation?._salaryAnalysis?.medianAnnualSalary ?? null,
      earningsAverageSalaryAlumni: null,
      earningsAverageLivingExpense: null,
      earningsDispoableIncomeMinimum: null,
      earningsDispoableIncomeMaximum: null,
      earningsYearsToBreakEven: null,

      totalReturnMinimumAmount: null,
      totalReturnMaximumAmount: null,
      totalReturnMinimumPercent: null,
      totalReturnMaximumPercent: null
    };

    return compareModel;
  }

  isReadyForCompare(input: RoiModelDto): boolean
  {
    const careerGoal: CareerGoalDto = input.careerGoal;
    const educationCost: EducationCostDto = input.educationCost;

    const isGoalReady: boolean = (careerGoal.occupation !== null && careerGoal.degreeLevel !== null && careerGoal.degreeProgram !== null);
    const isInstitutionReady: boolean = (educationCost.institution !== null);

    return isGoalReady && isInstitutionReady;
  }
}
