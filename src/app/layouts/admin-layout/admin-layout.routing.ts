import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { VisitComponent } from '../../visit/visit.component';
import { InstituteComponent } from '../../institute/institute.component';
import { ProfessionalComponent } from '../../professional/professional.component';
import { PatientComponent } from 'app/patient/patient.component';
import { SectorComponent } from 'app/sector/sector.component';
import { UserComponent } from 'app/user/user.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'patient', component: PatientComponent },
    { path: 'visit', component: VisitComponent },
    { path: 'professional', component: ProfessionalComponent },
    { path: 'sector', component: SectorComponent },
    { path: 'user', component: UserComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'institute', component: InstituteComponent }
];
