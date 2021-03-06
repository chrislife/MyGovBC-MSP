import {Component, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'msp-phn',
  templateUrl: './phn.component.html',

})

export class MspPhnComponent {
  lang = require('./i18n');

  @Input() required: boolean = true;
  @Input() phnLabel: string = this.lang("./en/index.js").phnLabel;
  @Input() phn: string;
  @Output() phnChange = new EventEmitter<string>();
  @Input() bcPhn: boolean = false;


}