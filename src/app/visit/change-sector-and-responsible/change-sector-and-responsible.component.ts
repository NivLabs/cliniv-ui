import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { AttendanceService } from 'app/attendance/attendance.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { Accommodation } from 'app/model/Accommodation';
import { NewAttendanceEvent } from 'app/model/Attendance';
import { ProcedureInfo } from 'app/model/Procedure';
import { Professional } from 'app/model/Professional';
import { Sector, SectorFilters } from 'app/model/Sector';
import { Specialization } from 'app/model/Specialization';
import { Pageable } from 'app/model/Util';
import { SectorService } from 'app/sector/sector.service';
import { MedicalRecordService } from '../medical-record.service';

@Component({
  selector: 'app-change-sector-and-responsible',
  templateUrl: './change-sector-and-responsible.component.html',
  styleUrls: ['./change-sector-and-responsible.component.css']
})
export class ChangeSectorAndResponsibleComponent implements OnInit {

  loading = false;

  specializationControl = new UntypedFormControl('', [Validators.required]);
  sectorControl = new UntypedFormControl('', [Validators.required]);
  accommodationControl = new UntypedFormControl('', [Validators.required]);
  responsibleControl = new UntypedFormControl('', [Validators.required]);

  specializationsData: Array<Specialization> = [];
  responsibles: Array<Professional> = [];
  sectors: Array<Sector> = [];
  accommodations: Array<Accommodation> = [];

  dataToForm: NewAttendanceEvent;

  filters = new SectorFilters();
  pageSettings = new Pageable();

  constructor(
    public dialogRef: MatDialogRef<NewAttendanceEvent>,
    public attendanceService: AttendanceService,
    public sectorService: SectorService,
    public notification: NotificationsComponent,
    public utilService: UtilService,
    public visitService: MedicalRecordService,
    private errorHandler: ErrorHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    const data = this.dialogRef.componentInstance['data'];
    if (data) {
      this.dataToForm = new NewAttendanceEvent();
      this.dataToForm.attendanceId = data.attendanceId;
      this.dataToForm.accommodation = data['lastAccommodation'] ? data['lastAccommodation'] : new Accommodation();
      this.dataToForm.documents = [];
      this.dataToForm.responsible = data['lastProfessional'] ? data['lastProfessional'] : new Professional();
      this.dataToForm.procedure = new ProcedureInfo();
    } else {
      this.dialogRef.close();
    }

    this.loadSectors();
    this.loadspecializationsData();

  }

  loadSectors() {
    this.sectorService.getPage(this.filters, this.pageSettings).then(response => {
      this.sectors = response.content;
    });
  }

  loadspecializationsData() {
    this.loading = true;
    this.utilService.getSpecialization().then(specs => {
      this.loading = false;
      this.specializationsData = specs.content
    }).catch(ex => this.loading = false);
  }

  loadAccommodations(event: any) {
    var sectorId = event.value;
    if (sectorId) {
      this.loading = true;
      this.sectorService.getById(sectorId).then(response => {
        this.loading = false;
        this.accommodations = response.listOfRoomsOrBeds;
        if (!this.accommodations || !this.accommodations.length) {
          this.notification.showError("Nenhuma acomodação cadastrada para este setor/leito, realize o cadastro antes de continuar.");
        }
      }).catch(e => {
        this.loading = false
        this.errorHandler.handle(e, null);
        this.accommodations
      });
    }
  }

  loadResponsibles(event: any) {
    if (event.value) {
      this.loading = true;
      this.utilService.getSpecializationById(event.value).then(response => {
        this.loading = false;
        if (!response.responsibles || !response.responsibles.length) {
          this.notification.showWarning("Nenhum profissional encontrado com a especialidade selecionada");
        }
        this.responsibles = response.responsibles;
      }).catch(e => {
        this.loading = false;
        this.responsibles = [];
      });
    }
  }

  selectEventType(newValue: string) {
    this.dataToForm.eventType = newValue;
  }


  selectResponsible(newValue) {
    this.dataToForm.responsible.id = newValue;
  }

  selectAccommodation(newValue) {
    this.dataToForm.accommodation.id = newValue;
  }

}
