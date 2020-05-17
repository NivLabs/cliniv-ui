import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MedicalRecordComponent } from '../../visit/medical-record.component';
import { ProfessionalComponent } from '../../professional/professional.component';
import { PatientComponent } from 'app/patient/patient.component';
import { SectorComponent } from 'app/sector/sector.component';
import { UserComponent } from 'app/user/user.component';
import { AttendanceComponent } from 'app/attendance/attendance.component';
import { SettingsComponent } from 'app/settings/settings.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'patient', component: PatientComponent },
    { path: 'visit', component: MedicalRecordComponent },
    { path: 'attendance', component: AttendanceComponent },
    { path: 'professional', component: ProfessionalComponent },
    { path: 'sector', component: SectorComponent },
    { path: 'user', component: UserComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'settings', component: SettingsComponent }
];
