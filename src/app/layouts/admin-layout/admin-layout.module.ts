//#region Componentes de terceiros
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
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { RouterModule } from '@angular/router';
import { CameraComponent } from 'app/core/camera/camera.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxLoadingModule } from 'ngx-loading';
import { WebcamModule } from 'ngx-webcam';
import { NgxMaskModule, IConfig } from 'ngx-mask';
//#endregion
//#region Componentes da aplicação
import { ConfirmDialogComponent } from '../../core/confirm-dialog/confirm-dialog.component';
import { NotificationsComponent } from '../../core/notification/notifications.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { InstituteComponent } from '../../institute/institute.component';
import { InstituteService } from '../../institute/institute.service';
import { PatientEditComponent } from '../../patient/patient-edit/patient-edit.component';
import { PatientComponent } from '../../patient/patient.component';
import { PatientService } from '../../patient/patient.service';
import { ProfessionalEditComponent } from '../../professional/professional-edit/professional-edit.component';
import { ProfessionalComponent } from '../../professional/professional.component';
import { ProfessionalService } from '../../professional/professional.service';
import { SectorEditComponent } from '../../sector/sector-edit/sector-edit.component';
import { SectorComponent } from '../../sector/sector.component';
import { SectorService } from '../../sector/sector.service';
import { SecurityModule } from '../../security/security.module';
import { ChangePasswordComponent } from '../../user-profile/change-password/change-password.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { UserProfileService } from '../../user-profile/user-profile.service';
import { UserEditComponent } from '../../user/user-edit/user-edit.component';
import { UserComponent } from '../../user/user.component';
import { UserService } from '../../user/user.service';
import { PatientHistoryComponent } from '../../visit/history/patient-history.component';
import { NewVisitComponent } from '../../visit/newVisit/new-visit.component';
import { VisitComponent } from '../../visit/visit.component';
import { VisitService } from '../../visit/visit.service'
  ; import { CameraDialogComponent } from 'app/component/camera/dialog/camera-dialog.component';
import { DocumentViewerComponent } from 'app/component/document-viewer/document-viewer.component';

import { AdminLayoutRoutes } from './admin-layout.routing';
//#endregion

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
    NgxLoadingModule,
    ReactiveFormsModule,
    SecurityModule,
    WebcamModule,
    NgxMaskModule.forRoot(maskConfig)
  ],
  exports: [
    CommonModule,
    FormsModule,
    matModules,
    InfiniteScrollModule,
    NgxLoadingModule,
    ReactiveFormsModule,
    SecurityModule
  ],
  declarations: [
    DashboardComponent,

    PatientComponent,
    PatientEditComponent,

    ProfessionalComponent,
    ProfessionalEditComponent,

    SectorComponent,
    SectorEditComponent,

    UserProfileComponent,
    ChangePasswordComponent,

    UserComponent,
    UserEditComponent,

    VisitComponent,
    PatientHistoryComponent,
    NewVisitComponent,

    InstituteComponent,
    NotificationsComponent,
    ConfirmDialogComponent,

    CameraComponent,
    CameraDialogComponent,
    DocumentViewerComponent
  ],
  entryComponents: [
    PatientEditComponent,
    PatientHistoryComponent,
    ChangePasswordComponent,
    NewVisitComponent,
    UserEditComponent,
    ConfirmDialogComponent,
    CameraDialogComponent,
    DocumentViewerComponent
  ],
  providers: [
    UserProfileService,
    PatientService,
    ProfessionalService,
    UserService,
    SectorService,
    VisitService,
    InstituteService
  ]
})

export class AdminLayoutModule { }
