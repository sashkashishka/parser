import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  exports: [MatInputModule, MatButtonModule, MatCardModule, MatSnackBarModule],
})
export class LoginMaterialModule {}
