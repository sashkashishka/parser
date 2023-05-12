import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { transition } from '@angular/animations';
import { FormService } from './form.service';
import { tNgFormValues } from '../types';
import { Validators } from '@angular/forms';
import { matFormFieldAnimations } from '@angular/material/form-field';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  animations: [matFormFieldAnimations.transitionMessages],
  // providers: [FormService],
})
export class FormComponent {
  authForm = new FormGroup<tNgFormValues>({
    name: new FormControl<string>('', {
      nonNullable: true,
      initialValueIsDefault: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      initialValueIsDefault: true,
      validators: [Validators.required],
    }),
  });

  // constructor(private formService: FormService) {}
}
