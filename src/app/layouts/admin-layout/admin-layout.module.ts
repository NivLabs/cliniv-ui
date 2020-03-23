//#region Componentes de terceiros
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatPseudoCheckboxModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { NgxLoadingModule } from 'ngx-loading';
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
import { SectorComponent } from '../../sector/sector.component';
import { ProfessionalService } from '../../professional/professional.service';
import { SecurityModule } from '../../security/security.module';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { UserProfileService } from '../../user-profile/user-profile.service';
import { PatientHistoryComponent } from '../../visit/history/patient-history.component';
import { NewVisitComponent } from '../../visit/newVisit/new-visit.component';
import { VisitComponent } from '../../visit/visit.component';
import { VisitService } from '../../visit/visit.service';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { MatDividerModule } from '@angular/material/divider';
//#endregion

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
    
    SectorComponent,
    
    UserProfileComponent,

    VisitComponent,
    PatientHistoryComponent,
    NewVisitComponent,

    InstituteComponent,
    NotificationsComponent,
    ConfirmDialogComponent
  ],
  entryComponents: [
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
