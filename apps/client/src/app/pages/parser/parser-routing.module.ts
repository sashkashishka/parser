import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParseUnitComponent } from './parse-unit/parse-unit.component';

const routes: Routes = [
  {
    path: '',
    component: ParseUnitComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParserRoutingModule {}
