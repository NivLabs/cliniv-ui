import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { MedicalRecordService } from '../medical-record.service';
import { Specialization } from 'app/model/Specialization';
import { Professional } from 'app/model/Professional';
import { NewAttendance } from 'app/model/Attendance';
import { EventType } from 'app/model/EventType';
import { Sector } from 'app/model/Sector';
import { SectorService } from 'app/sector/sector.service';


@Component({
    selector: 'app-new-attendance',
    templateUrl: './new-attendance.component.html'
})
export class NewAttendanceComponent implements OnInit {

    loading = false;

    eventTypeControl = new FormControl('', [Validators.required]);
    specializationControl = new FormControl('', [Validators.required]);
    sectorControl = new FormControl('', [Validators.required]);
    responsibleControl = new FormControl();


    eventTypes: Array<EventType> = [];
    specializationsData: Array<Specialization> = [];
    responsibles: Array<Professional> = [];
    sectors: Array<Sector> = [];

    newVisit: NewAttendance;

    constructor(public dialogRef: MatDialogRef<NewAttendanceComponent>, public sectorService: SectorService, public notification: NotificationsComponent, public utilService: UtilService, public visitService: MedicalRecordService,
        @Inject(MAT_DIALOG_DATA) public data: number) { }

    ngOnInit(): void {
        if (this.dialogRef.componentInstance.data !== null) {
            this.newVisit = new NewAttendance();
            this.newVisit.patientId = this.dialogRef.componentInstance.data['patientId'];
            this.newVisit.entryCause = '';
            this.newVisit.responsibleId = null;
            this.newVisit.eventTypeId = null;
        }


        this.loadEntryEventTypes();
        this.loadSectors();
        this.loadspecializationsData();

    }
    loadSectors() {
        this.sectorService.getListOfSectors(null).then(response => {
            this.sectors = response;
        });
    }

    loadEntryEventTypes() {
        this.utilService.getEventTypes().then(events => {
            events.forEach(event => {
                if (event.superEventType && event.superEventType.id === 1)
                    this.eventTypes.push(event);
            })
        });
    }

    loadspecializationsData() {
        this.utilService.getSpecialization().then(specs => {
            specs.forEach(spec => {
                this.specializationsData.push(spec);

            });
        });
    }

    loadResponsibles(event: any) {
        var especId = event.value;
        if (especId) {
            this.utilService.getSpecializationById(especId).then(response => {
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

    selectSector(newValue) {
        this.newVisit.sectorId = newValue;
    }

}  