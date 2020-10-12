import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttendanceService } from 'app/attendance/attendance.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { Accommodation } from 'app/model/Accommodation';
import { NewAttendance, NewAttendanceEvent } from 'app/model/Attendance';
import { EventType } from 'app/model/EventType';
import { ProcedureInfo } from 'app/model/Procedure';
import { Professional } from 'app/model/Professional';
import { Sector, SectorFilters } from 'app/model/Sector';
import { Specialization } from 'app/model/Specialization';
import { Pageable } from 'app/model/Util';
import { SectorService } from 'app/sector/sector.service';
import { MedicalRecordService } from '../medical-record.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {


  loading = false;

  eventTypeControl = new FormControl('', [Validators.required]);
  levelControl = new FormControl();
  sectorControl = new FormControl();
  accommodationControl = new FormControl('', [Validators.required]);
  responsibleControl = new FormControl('', [Validators.required]);
  procedureControl = new FormControl('');

  responsibles: Array<Professional> = [];
  sectors: Array<Sector> = [];
  accommodations: Array<Accommodation> = [];

  dataToForm: NewAttendanceEvent;

  sectorFilters = new SectorFilters();
  setorPageSettings = new Pageable();


  constructor(public dialogRef: MatDialogRef<NewEventComponent>, public attendanceService: AttendanceService, public sectorService: SectorService, public notification: NotificationsComponent, public utilService: UtilService, public visitService: MedicalRecordService, private errorHandler: ErrorHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    const data = this.dialogRef.componentInstance.data;
    if (this.dialogRef.componentInstance.data) {
      this.dataToForm = new NewAttendanceEvent();
      this.dataToForm.attendanceId = data.id;
      this.dataToForm.accommodation = data.lastAccommodation ? data.lastAccommodation : new Accommodation();
      this.dataToForm.eventType = new EventType();
      this.dataToForm.documents = [];
      this.dataToForm.responsible = new Professional();
      this.dataToForm.procedure = new ProcedureInfo();
    }
    this.loadSectors();
    this.procedureControl.registerOnChange((value) => {
      this.dataToForm.procedure.id = value;
    });
  }


  /**
   * Busca os setores
   */
  loadSectors() {
    this.sectorService.getPage(this.sectorFilters, this.setorPageSettings).then(response => {
      this.sectors = response.content;
    });
  }


  /**
   * Busca as acomodações à partir do identificador do setor
   * 
   * @param event Evento de change do Select
   */
  loadAccommodations(event: any) {
    var sectorId = event.value;
    if (sectorId) {
      this.sectorService.getById(sectorId).then(response => {
        this.accommodations = response.listOfRoomsOrBeds;
      }).catch(e => {
        this.accommodations = [];
      });
    }
  }

  selectAccommodation(id: number) {
    if (id) {
      this.dataToForm.accommodation.id = id;
    }
  }

  selectEventType(id: number) {
    if (id) {
      this.dataToForm.eventType.id = id;
    }
  }

  selectProcedure() {

  }

}
