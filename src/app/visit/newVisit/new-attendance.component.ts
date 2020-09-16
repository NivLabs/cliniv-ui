import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { MedicalRecordService } from '../medical-record.service';
import { Specialization } from 'app/model/Specialization';
import { Professional } from 'app/model/Professional';
import { NewAttendance } from 'app/model/Attendance';
import { Accommodation } from 'app/model/Accommodation';
import { Sector, SectorFilters } from 'app/model/Sector';
import { SectorService } from 'app/sector/sector.service';
import { Pageable } from 'app/model/Util';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { AttendanceService } from 'app/attendance/attendance.service';

@Component({
    selector: 'app-new-attendance',
    templateUrl: './new-attendance.component.html'
})
export class NewAttendanceComponent implements OnInit {

    loading = false;

    eventTypeControl = new FormControl('', [Validators.required]);
    specializationControl = new FormControl('', [Validators.required]);
    sectorControl = new FormControl('', [Validators.required]);
    accommodationControl = new FormControl('', [Validators.required]);
    responsibleControl = new FormControl();

    specializationsData: Array<Specialization> = [];
    responsibles: Array<Professional> = [];
    sectors: Array<Sector> = [];
    accommodations: Array<Accommodation> = [];

    newVisit: NewAttendance;

    filters = new SectorFilters();
    pageSettings = new Pageable();

    constructor(public dialogRef: MatDialogRef<NewAttendanceComponent>, public attendanceService: AttendanceService, public sectorService: SectorService, public notification: NotificationsComponent, public utilService: UtilService, public visitService: MedicalRecordService, private errorHandler: ErrorHandlerService,
        @Inject(MAT_DIALOG_DATA) public data: number) { }

    ngOnInit(): void {

        if (this.dialogRef.componentInstance.data !== null) {
            this.newVisit = new NewAttendance();
            this.newVisit.patientId = this.dialogRef.componentInstance.data['patientId'];
            this.newVisit.entryCause = '';
            this.newVisit.responsibleId = null;
            this.newVisit.eventTypeId = null;
            this.newVisit.accommodationId = null;
            this.newVisit.specialityId = null;
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
        this.utilService.getSpecialization().then(specs => {
            specs.forEach(spec => {
                this.specializationsData.push(spec);

            });
        });
    }

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

    loadResponsibles(event: any) {
        this.newVisit.specialityId = event.value;
        if (this.newVisit.specialityId) {
            this.utilService.getSpecializationById(this.newVisit.specialityId).then(response => {
                this.responsibles = response.responsibles;
            }).catch(e => {
                this.responsibles = [];
            });
        }
    }

    selectEventType(newValue) {
        this.newVisit.eventTypeId = newValue;
    }

    selectResponsible(newValue) {
        this.newVisit.responsibleId = newValue;
    }

    selectAccommodation(newValue) {
        this.newVisit.accommodationId = newValue;
    }

}