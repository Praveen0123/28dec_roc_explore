import { Injectable } from '@angular/core';
import { Institution, TestScores } from '@gql';

import { RoiAggregate } from '../domain';
import { RoiModelService } from './roi-model.service';


@Injectable()
export class RoiModelAnalysisService
{

  constructor
    (
      private roiModelService: RoiModelService
    )
  {
  }

  getGraduationRate(): number
  {
    const roiAggregate: RoiAggregate = this.roiModelService.roiAggregate;
    // const degreeLevel: EducationLevelEnum = roiAggregate.roiModel.careerGoal.degreeLevel;
    const institution: Institution = roiAggregate.props.roiModel.educationCost.institution;
    const yearsToComplete: number = roiAggregate.props.roiModel.educationCost.yearsToCompleteDegree;

    var rates: Map<number, Function> = new Map();
    rates.set(0, () => institution?.gr150Default ?? null);
    rates.set(1, () => institution?.gr100 ?? null);
    rates.set(2, () => institution?.gr100 ?? null);
    rates.set(3, () => institution?.gr100 ?? null);
    rates.set(4, () => institution?.gr100 ?? null);
    rates.set(5, () => institution?.gr150Default ?? null);
    rates.set(6, () => institution?.gr150Default ?? null);
    rates.set(7, () => institution?.gr200 ?? null);
    rates.set(8, () => institution?.gr200 ?? null);

    return (rates.get(yearsToComplete) || rates.get(0))();
  }

  getMinimumScoresByType(type: string, section: string): number
  {
    const roiAggregate: RoiAggregate = this.roiModelService.roiAggregate;
    const institution: Institution = roiAggregate.props.roiModel.educationCost.institution;
    const key: string = `${type.trim().toUpperCase()}_${section.trim().toUpperCase()}`;

    var scores: Map<string, Function> = new Map();
    scores.set('ACT_MATH', () => institution?.testScoresList?.find((item: TestScores) => (item.type === 'ACT' && item.section === 'Math')).percentileScore25 ?? null);
    scores.set('ACT_READING', () => institution?.testScoresList?.find((item: TestScores) => (item.type === 'ACT' && item.section === 'English')).percentileScore25 ?? null);
    scores.set('SAT_MATH', () => institution?.testScoresList?.find((item: TestScores) => (item.type === 'SAT' && item.section === 'Math')).percentileScore25 ?? null);
    scores.set('SAT_READING', () => institution?.testScoresList?.find((item: TestScores) => (item.type === 'SAT' && item.section === 'Evidence-Based Reading and Writing')).percentileScore25 ?? null);

    return (scores.get(key) || null)();
  }

  getMaximumScoresByType(type: string, section: string): number
  {
    const roiAggregate: RoiAggregate = this.roiModelService.roiAggregate;
    const institution: Institution = roiAggregate.props.roiModel.educationCost.institution;
    const key: string = `${type.trim().toUpperCase()}_${section.trim().toUpperCase()}`;

    var scores: Map<string, Function> = new Map();
    scores.set('ACT_MATH', () => institution?.testScoresList?.find((item: TestScores) => (item.type === 'ACT' && item.section === 'Math')).percentileScore75 ?? null);
    scores.set('ACT_READING', () => institution?.testScoresList?.find((item: TestScores) => (item.type === 'ACT' && item.section === 'English')).percentileScore75 ?? null);
    scores.set('SAT_MATH', () => institution?.testScoresList?.find((item: TestScores) => (item.type === 'SAT' && item.section === 'Math')).percentileScore75 ?? null);
    scores.set('SAT_READING', () => institution?.testScoresList?.find((item: TestScores) => (item.type === 'SAT' && item.section === 'Evidence-Based Reading and Writing')).percentileScore75 ?? null);

    return (scores.get(key) || null)();
  }

  getNetPrice(): number
  {
    const roiAggregate: RoiAggregate = this.roiModelService.roiAggregate;
    const institution: Institution = roiAggregate.props.roiModel.educationCost.institution;

    // TODO: take user's residency into consideration
    const netPrice: number = institution?.costOfAttendanceInfo.tuitionAndFees.inState.expenseAmount ?? null;

    return netPrice;
  }

  getFederalLoanAmount(): number
  {
    const roiAggregate: RoiAggregate = this.roiModelService.roiAggregate;
    const amount: number = (roiAggregate.props.roiModel.educationFinancing?.federalLoanAmountByYear) ? roiAggregate.props.roiModel.educationFinancing.federalLoanAmountByYear.reduce((p, c) => p + c, 0) : null;

    return amount ?? 0;
  }

  getPrivateLoanAmount(): number
  {
    const roiAggregate: RoiAggregate = this.roiModelService.roiAggregate;
    const amount: number = (roiAggregate.props.roiModel.educationFinancing?.privateLoanAmountByYear) ? roiAggregate.props.roiModel.educationFinancing.privateLoanAmountByYear.reduce((p, c) => p + c, 0) : null;

    return amount ?? 0;
  }

  getOutOfPocketExpensesAmount(): number
  {
    const roiAggregate: RoiAggregate = this.roiModelService.roiAggregate;
    const amount: number = (roiAggregate.props.roiModel.educationFinancing?.outOfPocketExpensesByYear) ? roiAggregate.props.roiModel.educationFinancing.outOfPocketExpensesByYear.reduce((p, c) => p + c, 0) : null;

    return amount ?? 0;
  }

}
