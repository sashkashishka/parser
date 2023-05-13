import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParserRoutingModule } from './parser-routing.module';
import { ParseUnitComponent } from './parse-unit/parse-unit.component';
import { SidebarComponent } from './parse-unit/sidebar/sidebar.component';
import { ResultsComponent } from './parse-unit/results/results.component';

@NgModule({
  declarations: [ParseUnitComponent, SidebarComponent, ResultsComponent],
  imports: [CommonModule, ParserRoutingModule],
})
export class ParserModule {}
