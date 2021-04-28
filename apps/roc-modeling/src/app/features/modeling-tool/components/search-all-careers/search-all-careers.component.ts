import
{
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import * as _ from 'lodash';

import
{
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';

import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'roc-search-all-careers',
  templateUrl: './search-all-careers.component.html',
  styleUrls: ['./search-all-careers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchAllCareersComponent implements OnInit
{

  searchAllCareersForm: FormGroup;
  fakeDegreeDataProgram: any;
  filterDegreeProgram: any;

  uniqueSearchCareer: any;
  searchCareerArray: any;
  filteredSearchCareer: any;
  uniqueJobFamiliers: any;
  jobFamiliesArray: any;
  filteredJobFamilies: any;

  degreeAlignmentWithCareer = [
    'Recommended Programs',
    'Closely Related Programs',
    'Programs in a Related Field',
    'Somewhat Related Field',
    'Any Programs Regardless of Alignment',
  ];

  careerDemand = ['High', 'Medium', 'Low'];
  careerGrowth = ['High', 'Medium', 'Low'];
  displayedColumns: string[] = ['Career Name', 'Job Families', 'Demand', 'Growth', 'Annual Salary', 'Align', 'symbol'];


  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit()
  {
    this.filterDegreeProgram.paginator = this.paginator;
  }
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SearchAllCareersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
  {
    this.createsSearchAllCareersForm();
  }

  createsSearchAllCareersForm()
  {
    this.searchAllCareersForm = this.fb.group({
      degreeAlignmentWithCareer: [''],
      searchCareers: new FormControl(undefined, [
        Validators.required,
        this.requireMatchSchoolName.bind(this),
      ]),
      location: [''],

      jobFamilies: new FormControl(undefined, [
        Validators.required,
        this.requireMatchDistance.bind(this),
      ]),
      annualSalary: [''],
      careerDemand: [''],
      careerGrowth: ['']
    });
  }
  ngOnInit(): void
  {
    this.fakeDegreeDataProgram = [
      {
        degreeId: '1',
        careerName: 'Environmental consultant',
        jobFamilies: 'Architecture and Engineering',
        demand: 'High',
        growth: 'Low',
        annualSalary: 10,
        align: 'Recommended Programs',

      },
      {
        degreeId: '2',
        careerName: 'Environmental eduaction officer',
        jobFamilies: 'Business and Financial Operations',
        demand: 'Medium',
        growth: 'Low',
        annualSalary: 15,
        align: 'Closely Related Programs',

      },
      {
        degreeId: '3',
        careerName: 'Environmental engineer',
        jobFamilies: 'Community and Social Service',
        demand: 'Low',
        growth: 'High',
        annualSalary: 20,
        align: 'Programs in a Related Field',

      },
      {
        degreeId: '4',
        careerName: 'Environmental Management',
        jobFamilies: 'Computer and Mathematical',
        demand: 'High',
        growth: 'Medium',
        annualSalary: 21,
        align: 'Somewhat Related Field',

      },
      {
        degreeId: '5',
        careerName: 'Marine Biologist',
        jobFamilies: 'Construction and Extraction',
        demand: 'Medium',
        growth: 'low',
        annualSalary: 22,
        align: 'Any Programs Regardless of Alignment',

      },
      {
        degreeId: '6',
        careerName: 'Minerals Surveyor',
        jobFamilies: 'Healthcare support',
        demand: 'High',
        growth: 'Medium',
        annualSalary: 24,
        align: 'Recommended Programs',

      },
      {
        degreeId: '7',
        careerName: 'Sustainability consultant',
        jobFamilies: 'Legal',
        demand: 'Low',
        growth: 'High',
        annualSalary: 25,

        align: 'Closely Related Programs',

      },
      {
        degreeId: '8',
        careerName: 'Waste Management Officer',
        jobFamilies: 'Healthcare Support',
        demand: 'Medium',
        growth: 'High',
        annualSalary: '18',
        align: 'Any Programs Regardless of Alignment',


      },
      {
        degreeId: '9',
        careerName: 'Water Quality Scientist',
        jobFamilies: 'Production',
        demand: 'High',
        growth: 'Medium',
        annualSalary: '23',
        align: 'Recommended Programs',

      },

    ];

    // this.filterDegreeProgram = this.fakeDegreeDataProgram;

    this.filterDegreeProgram = new MatTableDataSource<any>(
      this.fakeDegreeDataProgram
    );

    /***************** SEARCH CAREER FILTER *********************************************/
    this.uniqueSearchCareer = _.uniqBy(this.fakeDegreeDataProgram, 'careerName');

    this.searchCareerArray = _.map(this.uniqueSearchCareer, 'careerName');

    this.filteredSearchCareer = this.searchAllCareersForm.controls.searchCareers.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterSearchCareer(value))
    );

    /***************************************************************************************/

    /************************* JOB FAMILIES FILTER ***************************************************/

    this.uniqueJobFamiliers = _.uniqBy(this.fakeDegreeDataProgram, 'jobFamilies');

    this.jobFamiliesArray = _.map(this.uniqueJobFamiliers, 'jobFamilies');

    this.filteredJobFamilies = this.searchAllCareersForm.controls.jobFamilies.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterDistance(value))
    );

    /*********************************************************************************************/
  }

  /***************** SEARCH CAREER FILTER *********************************************/
  private requireMatchSchoolName(
    control: FormControl
  ): ValidationErrors | null
  {
    const selection: any = control.value;
    if (this.searchCareerArray && this.searchCareerArray.indexOf(selection) < 0)
    {
      return { requireMatchSchoolName: true };
    }
    return null;
  }

  private _filterSearchCareer(value: string): string[]
  {
    const filterValue = value.toLowerCase();

    return this.searchCareerArray.filter((optionSearchCareer: any) =>
      optionSearchCareer.toLowerCase().includes(filterValue)
    );
  }

  displayWithSearchCareer(obj?: any): string | undefined
  {
    return obj ? obj : undefined;
  }

  onsearchCareerSelected(
    matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent
  ): void
  {
    const searchCareers = matAutocompleteSelectedEvent.option.value;
    this.filterDegreeProgram = this.fakeDegreeDataProgram.filter(
      (x: any) => x.careerName === searchCareers
    );
  }

  // CLEAR BUTTON FOR SEARCH CAREER
  clearSearchFieldSearchCareer()
  {
    this.searchAllCareersForm.controls.searchCareers.patchValue('');
    this.filterDegreeProgram = this.fakeDegreeDataProgram;
  }
  /*********************************************************************************************/

  /************************* JOB FAMILIES FILTER  ***************************************************/
  private requireMatchDistance(control: FormControl): ValidationErrors | null
  {
    const selection: any = control.value;
    if (this.jobFamiliesArray && this.jobFamiliesArray.indexOf(selection) < 0)
    {
      return { requireMatchDistance: true };
    }
    return null;
  }

  private _filterDistance(value: string): string[]
  {
    const filterValuedistance = value.toLowerCase();

    return this.jobFamiliesArray.filter((optionJobFamilies: any) =>
      optionJobFamilies.toLowerCase().includes(filterValuedistance)
    );
  }

  displayWithJobFamilies(obj?: any): string | undefined
  {
    return obj ? obj : undefined;
  }

  onJobFamiliesSelected(
    matAutocompleteSelectedEvent: MatAutocompleteSelectedEvent
  ): void
  {
    const jobFamilies = matAutocompleteSelectedEvent.option.value;
    this.filterDegreeProgram = this.fakeDegreeDataProgram.filter(
      (x: any) => x.jobFamilies === jobFamilies
    );
  }

  // CLEAR BUTTON FOR JOB FAMILIES
  clearSearchFieldJobFamilies()
  {
    this.searchAllCareersForm.controls.jobFamilies.patchValue('');
    this.filterDegreeProgram = this.fakeDegreeDataProgram;
  }
  /*******************************************************************************************************/

  // ON CLOSE DIALOG, VALUE SELECTED CAPTURED AFTER CLICK PLUS ICON
  captureDegreeProgram(value: any)
  {
    this.dialogRef.close(value);
    console.log('value captured', value);
  }

  // CLOSE DIALOG WITH CLOSE ICON
  close(): void
  {
    this.dialogRef.close();
  }

  // DEGREE ALIGNMENT WITH CAREER FILTER
  degreeAlignmentWithCareerSelected(selectedValue: MatSelectChange): void
  {
    this.filterDegreeProgram = this.fakeDegreeDataProgram.filter(
      (x: any) => x.align === selectedValue
    );
  }

  // CAREER DEMAND FILTER
  careerDemandSelected(selectedValue: MatSelectChange): void
  {
    this.filterDegreeProgram = this.fakeDegreeDataProgram.filter(
      (x: any) => x.demand === selectedValue
    );
  }


  // CAREER GROWTH FILTER
  careerGrowthSelected(selectedValue: MatSelectChange): void
  {
    this.filterDegreeProgram = this.fakeDegreeDataProgram.filter(
      (x: any) => x.growth === selectedValue
    );
  }


  // Starting Annual Salary FILTER
  filterAnnualSalary(event: any)
  {
    this.filterDegreeProgram = this.fakeDegreeDataProgram.filter(
      (x: any) => x.annualSalary >= event
    );
  }



}
