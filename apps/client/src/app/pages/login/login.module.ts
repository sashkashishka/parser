import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginMaterialModule } from './material.module';

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    LoginMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class LoginModule {}
