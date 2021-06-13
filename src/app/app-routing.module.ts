import { NotfoundComponent } from './notfound/notfound.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { NoPreloading, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  { path : 'home', component : HomeComponent},
  { path : '', redirectTo : '/home' , pathMatch : 'full'},
  {path : '' , loadChildren  : ()=> import('./employee/employee.module').then(m => m.EmployeeModule)},
  { path : '**', component : NotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy : NoPreloading})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
