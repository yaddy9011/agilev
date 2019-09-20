import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EvaluacionComponent } from './evaluacion/evaluacion.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  }
  ,
  {
    path:'home',
    component:HomeComponent
  }
  ,
  {
    path:'eval',
    component:EvaluacionComponent
  },
  {
    path:'registro',
    component:RegisterComponent
  }
  ,
  {
    path:'main',
    component:MainComponent
  }   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
