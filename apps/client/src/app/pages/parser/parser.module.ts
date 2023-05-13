import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParserRoutingModule } from './parser-routing.module';
import { ParserComponent } from './parser.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ResultsComponent } from './results/results.component';
import { ParserMaterialModule } from './material.module';
import { ParseUnitComponent } from './sidebar/parse-unit/parse-unit.component';
import { ParseUnitFormComponent } from './sidebar/parse-unit/form.component';

@NgModule({
  declarations: [
    ParserComponent,
    SidebarComponent,
    ResultsComponent,
    ParseUnitComponent,
    ParseUnitFormComponent,
  ],
  imports: [
    CommonModule,
    ParserRoutingModule,
    ParserMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ParserModule {}
