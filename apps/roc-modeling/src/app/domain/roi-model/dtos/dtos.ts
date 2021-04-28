import { EducationLevelEnum, IncomeRangeEnum, LivingConditionTypeEnum, ResidencyTypeEnum } from '@app/core/models';
import { Institution, InstructionalProgram, Location, Occupation } from '@gql';

import { CareerGoalPathEnum } from '../domain/career-goal.model';
import { RoiCalculatorInput, RoiCalculatorOutputModel } from '../models';


export interface RoiModelDto
{
  id?: string;
  name: string;
  currentInformation?: CurrentInformationDto;

  careerGoal: CareerGoalDto,
  educationCost: EducationCostDto,
  educationCostRefinement: EducationCostRefinementDto,
  educationFinancing: EducationFinancingDto;
  roiCalculatorInput: RoiCalculatorInput;
  roiCalculatorInputHash: string;
  roiCalculatorOutput: RoiCalculatorOutputModel;
  radiusInMiles: number;
  dateCreated: Date;
  lastUpdated: Date;

  costOfAttendanceByYear: number[];
  grantOrScholarshipAidExcludingPellGrant: number;
  efc: number;
  netPriceByYear: number[];
  federalSubsidizedLoanLimitByYear: number[];
  federalUnsubsidizedLoanLimitByYear: number[];
  outOfPocketExpensesByYear: number[];

  isDefaultModel: boolean;
  isReadyForCompare: boolean;
}



/* #region  CURRENT INFORMATION */

export interface CurrentInformationDto
{
  currentAge: number;
  occupation?: Occupation;
  location: Location;
  educationLevel: EducationLevelEnum;
}

/* #endregion */



/* #region  CAREER GOAL */

export interface CareerGoalDto
{
  location: Location;
  occupation: Occupation;
  degreeLevel: EducationLevelEnum;
  degreeProgram: InstructionalProgram;
  retirementAge: number;
  careerGoalPathType: CareerGoalPathEnum;
}

/* #endregion */



/* #region  EDUCATION COSTS */

export interface EducationCostDto
{
  institution: Institution;
  startYear: number;
  incomeRange: IncomeRangeEnum;
  isFulltime: boolean;
  yearsToCompleteDegree: number;
}
export interface EducationCostRefinementDto
{
  residencyType: ResidencyTypeEnum;
  livingConditionTypeEnum: LivingConditionTypeEnum;
  costOfAttendance: CostOfAttendanceDto;
  grantsAndScholarships: GrantsAndScholarshipsDto;
  expectedFamilyContribution: number;
}
export interface CostOfAttendanceDto
{
  tuitionAndFees: number;
  booksAndSupplies: number;
  roomAndBoard: number;
  otherExpenses: number;
}
export interface GrantsAndScholarshipsDto
{
  federalPellGrant: number;
  otherFederalGrants: number;
  stateOrLocalGrants: number;
  institutionalGrants: number;
  otherGrants: number;
  giBillBenefits: number;
  dodTuitionAssistance: number;
}

/* #endregion */



/* #region  EDUCATION FINANCING */

export interface EducationFinancingDto
{
  isTaxDependent: boolean;
  prefersIncomeBasedRepayment: boolean;
  outOfPocketExpensesByYear: number[];
  federalSubsidizedLoanAmountByYear: number[];
  federalUnsubsidizedLoanAmountByYear: number[];
  federalLoanAmountByYear: number[];
  privateLoanAmountByYear: number[];
  pellGrantAidByYear: number[];
  yearsToPayOffFederalLoan: number;
  yearsToPayOffPrivateLoan: number;
}

/* #endregion */


export interface DialogDataToKeepModel
{
  modelName: string;
  isGoalLocationSaved: boolean;
  isGoalOccupationSaved: boolean;
  isGoalDegreeLevelSaved: boolean;
  isGoalDegreeProgramSaved: boolean;
  isGoalRetirementAgeSaved: boolean;
  isEducationCostInstitutionSaved: boolean;
  isEducationCostStartSchoolSaved: boolean;
  isEducationCostPartTimeFullTimeSaved: boolean;
  isEducationCostYearsToCompleteSaved: boolean;
}
