import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'parser',
    loadChildren: () => import('./pages/parser/parser.module').then(mod => mod.ParserModule),
  },
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then(mod => mod.LoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
