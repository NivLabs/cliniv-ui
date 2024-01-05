import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatPseudoCheckboxModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AppointmentEditComponent } from 'app/appointment/appointment-edit/appointment-edit.component';
import { AppointmentComponent } from 'app/appointment/appointment.component';
import { AttendanceComponent } from 'app/attendance/attendance.component';
import { ReportGeneratorComponent } from 'app/attendance/report-generator/report-generator.component';
import { CameraDialogComponent } from 'app/component/camera/dialog/camera-dialog.component';
import { DocumentViewerComponent } from 'app/component/document-viewer/document-viewer.component';
import { CameraComponent } from 'app/core/camera/camera.component';
import { CustomPaginatorIntl } from 'app/core/CustomPaginatorIntl';
import { PersonDocumentDialogComponent } from 'app/core/person-document-dialog/person-document-dialog.component';
import { StickerEditComponent } from 'app/dashboard/sticker-edit/sticker-edit.component';
import { DocumentTemplateEditComponent } from 'app/document-template/document-template-edit/document-template-edit.component';
import { DocumentTemplateComponent } from 'app/document-template/document-template.component';
import { DocumentTemplateService } from 'app/document-template/document-template.service';
import { DynamicFormEditComponent } from 'app/dynamic-form/dynamic-form-edit/dynamic-form-edit.component';
import { DynamicFormQuestionComponent } from 'app/dynamic-form/dynamic-form-question/dynamic-form-question.component';
import { HealthOperatorEditComponent } from 'app/healthOperator/health-operator-edit/health-operator-edit.component';
import { HealthOperatorComponent } from 'app/healthOperator/health-operator.component';
import { HealthOperatorService } from 'app/healthOperator/health-operator.service';
import { HealthPlanService } from 'app/healthOperator/health-plan.service';
import { HealthPlanComponent } from 'app/healthOperator/health-plan/health-plan.component';
import { ProcedureEditComponent } from 'app/procedure/procedure-edit/procedure-edit.component';
import { ReportEditComponent } from 'app/report/report-edit/report-edit.component';
import { ReportComponent } from 'app/report/report.component';
import { ReportService } from 'app/report/report.service';
import { SettingsComponent } from 'app/settings/settings.component';
import { ChangeSectorAndResponsibleComponent } from 'app/visit/change-sector-and-responsible/change-sector-and-responsible.component';
import { CloseEventComponent } from 'app/visit/close-event/close-event.component';
import { DocumentSelectorComponent } from 'app/visit/document-selector/document-selector.component';
import { NewEventComponent } from 'app/visit/new-event/new-event.component';
import { PrescriptionEditComponent } from 'app/visit/prescription/prescription-edit/prescription-edit.component';
import { PrescriptionComponent } from 'app/visit/prescription/prescription.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { WebcamModule } from 'ngx-webcam';
import { AppointmentService } from '../../appointment/appointment.service';
import { AttendanceService } from '../../attendance/attendance.service';
import { LoadingComponent } from '../../components/loading/loading.component';
import { ConfirmDialogComponent } from '../../core/confirm-dialog/confirm-dialog.component';
import { NotificationsComponent } from '../../core/notification/notifications.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { DashboardService } from '../../dashboard/dashboard.service';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { PatientEditComponent } from '../../patient/patient-edit/patient-edit.component';
import { PatientComponent } from '../../patient/patient.component';
import { PatientService } from '../../patient/patient.service';
import { ProcedureComponent } from '../../procedure/procedure.component';
import { ProcedureService } from '../../procedure/procedure.service';
import { ProfessionalEditComponent } from '../../professional/professional-edit/professional-edit.component';
import { ProfessionalComponent } from '../../professional/professional.component';
import { ProfessionalService } from '../../professional/professional.service';
import { AccommodationComponent } from '../../sector/accommodation/accommodation.component';
import { SectorEditComponent } from '../../sector/sector-edit/sector-edit.component';
import { SectorComponent } from '../../sector/sector.component';
import { SectorService } from '../../sector/sector.service';
import { SecurityModule } from '../../security/security.module';
import { SettingsService } from '../../settings/settings.service';
import { SpecialityEditComponent } from '../../speciality/speciality-edit/speciality-edit.component';
import { SpecialityComponent } from '../../speciality/speciality.component';
import { SpecialityService } from '../../speciality/speciality.service';
import { ChangePasswordComponent } from '../../user-profile/change-password/change-password.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { UserProfileService } from '../../user-profile/user-profile.service';
import { UserEditComponent } from '../../user/user-edit/user-edit.component';
import { UserComponent } from '../../user/user.component';
import { UserService } from '../../user/user.service';
import { AllergyComponent } from '../../visit/allergy/allergy.component';
import { AttDynamicFormComponent } from '../../visit/dynamicForm/att-dynamic-form.component';
import { DynamicFormService } from '../../visit/dynamicForm/dynamic-form.service';
import { SelectFormComponent } from '../../visit/dynamicForm/select-form/select-form.component';
import { EvolutionComponent } from '../../visit/evolution/evolution.component';
import { PatientHistoryComponent } from '../../visit/history/patient-history.component';
import { MedicalRecordComponent } from '../../visit/medical-record.component';
import { MedicalRecordService } from '../../visit/medical-record.service';
import { NewAttendanceComponent } from '../../visit/newVisit/new-attendance.component';
import { AdminLayoutRoutes } from './admin-layout.routing';

const matModules = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatPseudoCheckboxModule,
  MatChipsModule,
  MatStepperModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatDividerModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
]

const maskConfig: Partial<IConfig> = {
  validation: true,
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    matModules,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SecurityModule,
    WebcamModule,
    NgxMaskModule.forRoot(maskConfig),
    PdfViewerModule,
    BrowserAnimationsModule,
    CKEditorModule,
    FullCalendarModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    matModules,
    InfiniteScrollModule,
    ReactiveFormsModule,
    SecurityModule,
    LoadingComponent,
    CKEditorModule,
    FullCalendarModule
  ],
  declarations: [
    DashboardComponent,
    StickerEditComponent,

    DynamicFormComponent,
    DynamicFormEditComponent,
    DynamicFormQuestionComponent,
    AttDynamicFormComponent,

    PatientComponent,
    PatientEditComponent,
    PersonDocumentDialogComponent,

    ProfessionalComponent,
    ProfessionalEditComponent,

    SectorComponent,
    SectorEditComponent,

    UserProfileComponent,
    ChangePasswordComponent,

    UserComponent,
    UserEditComponent,

    MedicalRecordComponent,
    PatientHistoryComponent,
    NewAttendanceComponent,

    NotificationsComponent,
    ConfirmDialogComponent,

    CameraComponent,
    CameraDialogComponent,
    DocumentViewerComponent,
    DocumentSelectorComponent,
    CloseEventComponent,
    NewEventComponent,

    AttendanceComponent,

    SettingsComponent,

    ProcedureComponent,
    ProcedureEditComponent,

    AccommodationComponent,

    DocumentTemplateComponent,
    DocumentTemplateEditComponent,

    DynamicFormComponent,
    SelectFormComponent,

    PrescriptionComponent,
    PrescriptionEditComponent,
    EvolutionComponent,
    ChangeSectorAndResponsibleComponent,

    AllergyComponent,

    LoadingComponent,

    HealthOperatorComponent,
    HealthOperatorEditComponent,
    HealthPlanComponent,

    AppointmentComponent,
    AppointmentEditComponent,

    SpecialityComponent,
    SpecialityEditComponent,

    ReportComponent,
    ReportEditComponent,

    ReportGeneratorComponent
  ],
  entryComponents: [
    PatientEditComponent,
    PatientHistoryComponent,
    PersonDocumentDialogComponent,
    ChangePasswordComponent,
    NewAttendanceComponent,
    AllergyComponent,
    PrescriptionComponent,
    PrescriptionEditComponent,
    EvolutionComponent,
    ProfessionalEditComponent,
    DynamicFormComponent,
    AppointmentEditComponent,
    SelectFormComponent,
    CloseEventComponent,
    SectorEditComponent,
    AccommodationComponent,
    DocumentSelectorComponent,
    HealthOperatorEditComponent,
    HealthPlanComponent,
    UserEditComponent,
    NewEventComponent,
    ConfirmDialogComponent,
    CameraDialogComponent,
    DocumentViewerComponent,
    ProcedureEditComponent,
    DocumentTemplateEditComponent,
    SpecialityEditComponent,
    DynamicFormEditComponent,
    DynamicFormQuestionComponent,
    AttDynamicFormComponent,
    ReportComponent,
    ReportEditComponent
  ],
  providers: [
    UserProfileService,
    PatientService,
    DashboardService,
    AppointmentService,
    DocumentTemplateService,
    DynamicFormService,
    HealthPlanService,
    ProfessionalService,
    UserService,
    SectorService,
    HealthOperatorService,
    MedicalRecordService,
    AttendanceService,
    SettingsService,
    ProcedureService,
    SpecialityService,
    ReportService,
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ]
})

export class AdminLayoutModule { }
