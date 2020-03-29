import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { VisitService } from '../visit.service';
import { Specialization } from 'app/model/Specialization';
import { Professional } from 'app/model/Professional';
import { NewVisit } from 'app/model/Visit';
import { EventType } from 'app/model/EventType';


@Component({
    selector: 'app-new-visit',
    templateUrl: './new-visit.component.html'
})
export class NewVisitComponent implements OnInit {

    loading = false;

    eventTypeControl = new FormControl('', [Validators.required]);
    specializationControl = new FormControl('', [Validators.required]);
    responsibleControl = new FormControl();


    eventTypes: Array<EventType> = [];
    specializationsData: Array<Specialization> = [];
    responsibles: Array<Professional> = [];

    newVisit: NewVisit;

    constructor(public dialogRef: MatDialogRef<NewVisitComponent>, public notification: NotificationsComponent, public utilService: UtilService, public visitService: VisitService,
        @Inject(MAT_DIALOG_DATA) public data: number) { }

    ngOnInit(): void {
        if (this.dialogRef.componentInstance.data !== null) {
            this.newVisit = new NewVisit();
            this.newVisit.patientId = this.dialogRef.componentInstance.data['patientId'];
            this.newVisit.entryCause = '';
            this.newVisit.responsibleId = null;
            this.newVisit.eventTypeId = null;
        }


        this.loadEntryEventTypes();
        this.loadspecializationsData();

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
        if (event.value && event.value instanceof Number)
            this.utilService.getSpecializationById(event.value).then(response => {
                this.responsibles = response.responsibles;
            });
        else
            this.responsibles = [];
    }

    selectEventType(newValue) {
        console.log(newValue);
        this.newVisit.eventTypeId = newValue;
    }

    selectResponsible(newValue) {
        this.newVisit.responsibleId = newValue;
    }

}  