import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormComponent } from './form/form.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginMaterialModule } from './material.module';

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    LoginRoutingModule,
    LoginMaterialModule,
    // FormsModule,
    // ReactiveFormsModule,
  ],
  providers: [],
})
export class LoginModule {}
