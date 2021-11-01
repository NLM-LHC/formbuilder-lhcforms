import { TestBed } from '@angular/core/testing';

import { AnswerOptionComponent } from './answer-option.component';
import {CommonTestingModule} from '../../../testing/common-testing.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {
  ExpressionCompilerFactory,
  FormPropertyFactory, LogService, SchemaFormModule,
  SchemaValidatorFactory,
  ValidatorRegistry
} from '@lhncbc/ngx-schema-form';
import {PropertyBindingRegistry} from '@lhncbc/ngx-schema-form/lib/property-binding-registry';

describe('AnswerOptionComponent', () => {
//  let component: AnswerOptionComponent;
//  let service: TestingService;

  CommonTestingModule.setUpTestBedConfig({declarations: [AnswerOptionComponent]});
  beforeEach(() => {
//    service = TestBed.inject(TestingService);
//    component = service.createComponent(AnswerOptionComponent) as AnswerOptionComponent;
  });

  it('should create', () => {
//    expect(component).toBeDefined();
  });
});
