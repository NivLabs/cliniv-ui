import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityModule } from '../../security/security.module'

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';

import { PatientComponent } from '../../patient/patient.component';
import { PatientEditComponent } from '../../patient/patient-edit/patient-edit.component';

import { VisitComponent } from '../../visit/visit.component';
import { PatientHistoryComponent } from '../../visit/history/patient-history.component';

import { UserProfileComponent } from '../../user-profile/user-profile.component'
import { ProfessionalComponent } from '../../professional/professional.component';
import { InstituteComponent } from '../../institute/institute.component';
import { NotificationsComponent } from '../../core/notification/notifications.component';
import { ConfirmDialogComponent } from '../../core/confirm-dialog/confirm-dialog.component';

import { UserProfileService } from '../../user-profile/user-profile.service';
import { PatientService } from '../../patient/patient.service';
import { VisitService } from '../../visit/visit.service';
import { InstituteService } from '../../institute/institute.service';
import { NgxLoadingModule } from 'ngx-loading';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
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
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
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
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    NgxLoadingModule,

    FormsModule,

    SecurityModule
  ],
  declarations: [
    DashboardComponent,

    PatientComponent,
    PatientEditComponent,
    
    ProfessionalComponent,
    
    UserProfileComponent,
    
    VisitComponent,
    PatientHistoryComponent,

    InstituteComponent,
    NotificationsComponent,
    ConfirmDialogComponent
  ],
  entryComponents:[
    PatientEditComponent,
    PatientHistoryComponent,
    ConfirmDialogComponent
  ],
  providers: [
    UserProfileService,
    PatientService,
    VisitService,
    InstituteService
  ]
})

export class AdminLayoutModule { }
