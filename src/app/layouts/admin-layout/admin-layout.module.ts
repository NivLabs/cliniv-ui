import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityModule } from '../../security/security.module'

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';

import { PatientComponent } from '../../patient/patient.component';
import { PatientEditComponent } from '../../patient/patient-edit/patient-edit.component';

import { ProfessionalComponent } from '../../professional/professional.component';
import { ProfessionalEditComponent } from '../../professional/professional-edit/professional-edit.component';

import { VisitComponent } from '../../visit/visit.component';
import { PatientHistoryComponent } from '../../visit/history/patient-history.component';
import { NewVisitComponent } from '../../visit/newVisit/new-visit.component';

import { UserProfileComponent } from '../../user-profile/user-profile.component'
import { InstituteComponent } from '../../institute/institute.component';
import { NotificationsComponent } from '../../core/notification/notifications.component';
import { ConfirmDialogComponent } from '../../core/confirm-dialog/confirm-dialog.component';

import { UserProfileService } from '../../user-profile/user-profile.service';
import { PatientService } from '../../patient/patient.service';
import { ProfessionalService } from '../../professional/professional.service';
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
    FormsModule,

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

    ReactiveFormsModule,

    SecurityModule
  ],
  declarations: [
    DashboardComponent,

    PatientComponent,
    PatientEditComponent,
    
    ProfessionalComponent,
    ProfessionalEditComponent,
    
    UserProfileComponent,
    
    VisitComponent,
    PatientHistoryComponent,
    NewVisitComponent,

    InstituteComponent,
    NotificationsComponent,
    ConfirmDialogComponent
  ],
  entryComponents:[
    PatientEditComponent,
    PatientHistoryComponent,
    NewVisitComponent,
    ConfirmDialogComponent
  ],
  providers: [
    UserProfileService,
    PatientService,
    ProfessionalService,
    VisitService,
    InstituteService
  ]
})

export class AdminLayoutModule { }
