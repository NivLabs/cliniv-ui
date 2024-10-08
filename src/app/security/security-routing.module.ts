
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicScheduleComponent } from 'app/professional/public-schedule/public-schedule.component';
import { PatientRegisterComponent } from 'app/public-pages/patient-register/patient-register.component';
import { LoginFormComponent } from './login-form/login-form.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  { path: 'public-schedule', component: PublicScheduleComponent },
  { path: 'patient-register', component: PatientRegisterComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }