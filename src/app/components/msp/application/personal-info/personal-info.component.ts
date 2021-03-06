import {Component, Injectable, ViewChild} from '@angular/core';
import {MspApplication, Person} from '../../model/application.model';

import DataService from '../../service/msp-data.service';
import {Relationship} from "../../model/status-activities-documents";
import {NgForm} from "@angular/forms";

@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class PersonalInfoComponent {
  lang = require('./i18n');

  Relationship: typeof Relationship = Relationship;
  spouse:Person;
  @ViewChild('formRef') form: NgForm;

  constructor(private dataService: DataService){

  }

  valid(event: Object) {
    console.log("event: " + event);
    //this.form.valid = event;
  }

  save(){
    console.log('save person from personal-info screen');
    this.dataService.saveMspApplication();
  }

  get application(): MspApplication {
    return this.dataService.getMspApplication();
  }
  get applicant(): Person {
    return this.dataService.getMspApplication().applicant;
  }

  // get spouse(): Person {
  //   return this.dataService.getApplication().spouse;
  // }
  addSpouse = () =>{
    let sp:Person = new Person(Relationship.Spouse)    
    this.dataService.getMspApplication().addSpouse(sp);
    this.spouse = sp;
    // this.spouse = this.dataService.getApplication().spouse;
  };

  addChild(relationship: Relationship): void {
    this.dataService.getMspApplication().addChild(relationship);
  }

  get children(): Person[] {
    return this.dataService.getMspApplication().children;
  }

  removeChild(event: Object, idx: number): void{
    // console.log('remove child ' + JSON.stringify(event));
    this.dataService.getMspApplication().removeChild(idx);    
  }

  removeSpouse(event: Object): void{
    // console.log('remove spouse ' + JSON.stringify(event));
    this.dataService.getMspApplication().removeSpouse();
  }
}