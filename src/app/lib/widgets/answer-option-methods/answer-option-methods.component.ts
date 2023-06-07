import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AnswerOptionComponent} from '../answer-option/answer-option.component';
import {StringComponent} from '../string/string.component';
import {LabelRadioComponent} from '../label-radio/label-radio.component';
import {AnswerValueSetComponent} from '../answer-value-set/answer-value-set.component';
import {FormService} from '../../../services/form.service';

@Component({
  selector: 'lfb-answer-option-methods',
  templateUrl: './answer-option-methods.component.html'
})
export class AnswerOptionMethodsComponent extends LabelRadioComponent implements OnInit, AfterViewInit {

  @ViewChild('answerOption', {static: true, read: AnswerOptionComponent}) answerOption: AnswerOptionComponent;
  @ViewChild('answerValueSet', {static: true, read: StringComponent}) answerValueSet: StringComponent;
  isSnomedUser = false;

  constructor(private formService: FormService) {
    super();
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.isSnomedUser = this.formService.isSnomedUser();
    this.updateUI();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.formService.formReset$.subscribe(() => {
      this.updateUI();
    });
  }

  /**
   * Update UI widgets with initial value. The widget(s) is directly controlled by form property of __$answerOptionMethods. This
   * form property is internal. The snomed answer radio option may depend on the value of answerValueSet,
   * in which case it will update the formProperty of __$answerOptionMethods.
   */
  updateUI() {
    const valueSetUrl = this.formProperty.searchProperty('answerValueSet').value;
    if(valueSetUrl?.length > 0) {
      let valueSetType = 'value-set';
      if(this.isSnomedUser &&
        (valueSetUrl.startsWith(AnswerValueSetComponent.snomedBaseUri))) {
        valueSetType = 'snomed-value-set';
      }
      this.formProperty.setValue(valueSetType, false);
    }
  }
}
