import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  exports: [
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
})
export class ParserMaterialModule {}
