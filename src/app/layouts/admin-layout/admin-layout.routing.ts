import { Routes } from '@angular/router';

import { AppointmentComponent } from 'app/appointment/appointment.component';
import { DocumentTemplateComponent } from 'app/document-template/document-template.component';
import { DynamicFormComponent } from 'app/dynamic-form/dynamic-form.component';
import { HealthOperatorComponent } from 'app/healthOperator/health-operator.component';
import { ReportComponent } from 'app/report/report.component';
import { SpecialityComponent } from 'app/speciality/speciality.component';
import { AttendanceComponent } from '../../attendance/attendance.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { PatientComponent } from '../../patient/patient.component';
import { ProcedureComponent } from '../../procedure/procedure.component';
import { ProfessionalComponent } from '../../professional/professional.component';
import { SectorComponent } from '../../sector/sector.component';
import { SettingsComponent } from '../../settings/settings.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { UserComponent } from '../../user/user.component';
import { MedicalRecordComponent } from '../../visit/medical-record.component';
import { AuthGuard } from 'app/security/auth.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canLoad: [AuthGuard] },
    { path: 'patient', component: PatientComponent, canLoad: [AuthGuard] },
    { path: 'visit', component: MedicalRecordComponent, canLoad: [AuthGuard] },
    { path: 'attendance', component: AttendanceComponent, canLoad: [AuthGuard] },
    { path: 'appointment', component: AppointmentComponent, canLoad: [AuthGuard] },
    { path: 'procedure', component: ProcedureComponent, canLoad: [AuthGuard] },
    { path: 'professional', component: ProfessionalComponent, canLoad: [AuthGuard] },
    { path: 'sector', component: SectorComponent, canLoad: [AuthGuard] },
    { path: 'document-template', component: DocumentTemplateComponent, canLoad: [AuthGuard] },
    { path: 'dynamic-form', component: DynamicFormComponent, canLoad: [AuthGuard] },
    { path: 'speciality', component: SpecialityComponent, canLoad: [AuthGuard] },
    { path: 'health-operator', component: HealthOperatorComponent, canLoad: [AuthGuard] },
    { path: 'user', component: UserComponent, canLoad: [AuthGuard] },
    { path: 'user-profile', component: UserProfileComponent, canLoad: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canLoad: [AuthGuard] },
    { path: 'report', component: ReportComponent, canLoad: [AuthGuard] }
];
