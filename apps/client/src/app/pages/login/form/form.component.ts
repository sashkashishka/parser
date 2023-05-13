import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormService } from './form.service';
import { iAuthFormValues, tNgAuthFormValues } from '../types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [FormService],
})
export class FormComponent {
  authForm = new FormGroup<tNgAuthFormValues>({
    username: new FormControl<string>('', {
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

  constructor(private formService: FormService) {}

  public get username() {
    return this.authForm.get('username');
  }

  public get password() {
    return this.authForm.get('password');
  }

  public get submitting() {
    return this.formService.submitting;
  }

  public onSubmit() {
    return this.formService.submit(this.authForm.value as iAuthFormValues);
  }
}
