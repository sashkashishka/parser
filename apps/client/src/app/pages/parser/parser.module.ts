import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParserRoutingModule } from './parser-routing.module';
import { ParserComponent } from './parser.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ResultsComponent } from './results/results.component';
import { ParserMaterialModule } from './material.module';

@NgModule({
  declarations: [ParserComponent, SidebarComponent, ResultsComponent],
  imports: [CommonModule, ParserRoutingModule, ParserMaterialModule],
})
export class ParserModule {}
