import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { PatientComponent } from '../../patient/patient.component';
import { MedicalRecordComponent } from '../../visit/medical-record.component';
import { AttendanceComponent } from '../../attendance/attendance.component';
import { ProcedureComponent } from '../../procedure/procedure.component';
import { ProfessionalComponent } from '../../professional/professional.component';
import { SectorComponent } from '../../sector/sector.component';
import { UserComponent } from '../../user/user.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { SettingsComponent } from '../../settings/settings.component';
import { HealthOperatorComponent } from 'app/healthOperator/health-operator.component';
import { ScheduleComponent } from 'app/schedule/schedule.component';
import { SpecialityComponent } from 'app/speciality/speciality.component';
import { DynamicFormComponent } from 'app/dynamic-form/dynamic-form.component';
import { ReportComponent } from 'app/report/report.component';
import { DocumentTemplateComponent } from 'app/document-template/document-template.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'patient', component: PatientComponent },
    { path: 'visit', component: MedicalRecordComponent },
    { path: 'attendance', component: AttendanceComponent },
    { path: 'schedule', component: ScheduleComponent },
    { path: 'procedure', component: ProcedureComponent },
    { path: 'professional', component: ProfessionalComponent },
    { path: 'sector', component: SectorComponent },
    { path: 'document-template', component: DocumentTemplateComponent },
    { path: 'dynamic-form', component: DynamicFormComponent },
    { path: 'speciality', component: SpecialityComponent },
    { path: 'health-operator', component: HealthOperatorComponent },
    { path: 'user', component: UserComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'report', component: ReportComponent }
];
