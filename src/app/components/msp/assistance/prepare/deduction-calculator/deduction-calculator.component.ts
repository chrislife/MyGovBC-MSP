import {
  Component, Input, Output, OnInit, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';

import {FinancialAssistApplication} from '../../../model/financial-assist-application.model';
require('./deduction-calculator.less');

@Component({
  selector: 'deduction-calculator',
  templateUrl: './deduction-calculator.html'
})

export class DeductionCalculatorComponent implements OnInit, AfterViewInit{
  @Input() application: FinancialAssistApplication;
  @Output() updateQualify:EventEmitter<Boolean> = new EventEmitter<Boolean>();
  private qualificationThreshhold:number = 42000;
  lang = require('./i18n');
  
  constructor(){
  }

  ngOnInit(){
    
  }
  ngAfterViewInit(){

  }

  get ageOver65Amt():number {
    return !!this.application.ageOver65? 3000: 0;
  }

  get spouseAmt(): number {
    return !!this.application.hasSpouseOrCommonLaw? 3000: 0; 
  }

  get spouseAgeOver65Amt(): number {
    return !!this.application.spouseAgeOver65? 3000: 0;
  }

  get childrenAmt(): number {
    let cnt:number = (!!this.application.childrenCount && this.application.childrenCount > 0)? this.application.childrenCount : 0;
    return cnt * 3000;
  }

  get childCareExpense(): number {
    return !!this.application.claimedChildCareExpense_line214? this.application.claimedChildCareExpense_line214 : 0;
  }
  get uCCBenefitAmt(): number {
    return !!this.application.reportedUCCBenefit_line117? this.application.reportedUCCBenefit_line117 : 0;
  }

  get disabilityCreditAmt(): number {
    return !!this.application.selfDisabilityCredit? 3000: 0;
  }

  get spouseDisabilityCreditAmt(): number {
    return !!this.application.spouseEligibleForDisabilityCredit? 3000: 0;
  }

  get totalDeductions(): number{
    let total = this.ageOver65Amt
    + this.spouseAmt
    + this.spouseAgeOver65Amt
    + this.childrenAmt
    + this.childCareExpense
    + this.uCCBenefitAmt
    + this.disabilityCreditAmt
    + this.spouseDisabilityCreditAmt
    + this.application.spouseDSPAmount_line125;
    return total;
  }
  get adjustedIncome(): number{
    let adjusted:number = parseFloat(this.totalHouseholdIncome) - this.totalDeductions;
    adjusted < 0? adjusted = 0 : adjusted = adjusted;
    this.application.eligibility.adjustedNetIncome = adjusted;
    this.application.eligibility.totalDeductions = this.totalDeductions;

    return adjusted;
  }

  get applicantIncomeInfoProvided() {
    let result = (!!this.application.netIncomelastYear && !isNaN(this.application.netIncomelastYear) && (this.application.netIncomelastYear+'').trim() !== '');
    let stamp = new Date().getTime();
    // console.log( stamp + '- income info number : ' + this.application.netIncomelastYear);
    // console.log(stamp + '- income info provided? : ' + result);
    return result;
  }
  get spouseIncomeInfoProvided() {
    let result = (!!this.application.spouseIncomeLine236 && !isNaN(this.application.spouseIncomeLine236) && (this.application.spouseIncomeLine236+'').trim() !== '');
    return result;
  }

  // get incomeInfoProvided() {
  //   if(this.application.hasSpouseOrCommonLaw === true){
  //     return this.spouseIncomeInfoProvided && this.applicantIncomeInfoProvided;
  //   }else{
  //     return this.applicantIncomeInfoProvided;
  //   }
  // }

  get incomeUnderThreshhold() {
    return this.adjustedIncome <= this.qualificationThreshhold;
  }

  get canContinue(){
    let spouseSpecified = 
      !(this.application.hasSpouseOrCommonLaw === null || this.application.hasSpouseOrCommonLaw === undefined);
      
    let spouseAgeSpecified = !(this.application.spouseAgeOver65 === null || this.application.spouseAgeOver65 === undefined);
    let applicantAgeSpecified = !(this.application.ageOver65 === null || this.application.ageOver65 == undefined);

    // console.log('=========================================');
    // console.log('applicantIncomeInfoProvided: ' + this.applicantIncomeInfoProvided);
    // console.log('applicantAgeSpecified: ' + applicantAgeSpecified);
    // console.log('spouseSpecified: ' + spouseSpecified);
    // console.log('hasSpouseOrCommonLaw: ' + this.application.hasSpouseOrCommonLaw);
    // console.log('spouseAgeSpecified: ' + spouseAgeSpecified);
     if(this.applicantIncomeInfoProvided && applicantAgeSpecified && spouseSpecified){
       if(this.application.hasSpouseOrCommonLaw){
         return spouseAgeSpecified;
       }else{
         return true;
       }
     }else{
       return false;
     }
  }

  get isPristine(){
    return (this.application.ageOver65 !== true && this.application.ageOver65 !== false) && 
      (this.application.netIncomelastYear === null || this.application.netIncomelastYear === undefined);
  }

  get personalIncome(): number {
    if(this.application.netIncomelastYear === null){
      return null;
    }
    let n = (!!this.application.netIncomelastYear && 
      !isNaN(this.application.netIncomelastYear))? this.application.netIncomelastYear : 0;

    return parseFloat(n+'');
  }

  get spouseIncome(): number {
    // let n= (!!this.application.spouseIncomeLine236 && !isNaN(this.application.spouseIncomeLine236))? this.application.spouseIncomeLine236 : 0;
    let n= this.spouseIncomeInfoProvided? this.application.spouseIncomeLine236 : 0;
    return parseFloat(n+'');
  }

  get totalHouseholdIncome(): string {
    let t:number = this.personalIncome + this.spouseIncome;
    let total: string = new Number(t).toFixed(2);
    return total;
  }

  
}