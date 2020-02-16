import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { EventType, UtilService } from 'app/core/util.service';
import { Responsible, Specialization, Visit, VisitService, NewVisit } from '../visit.service';


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
    specializations: Array<Specialization> = [];
    responsibles: Array<Responsible> = [];

    newVisit: NewVisit;

    constructor(public dialogRef: MatDialogRef<NewVisitComponent>, public notification: NotificationsComponent, public utilService: UtilService, public visitService: VisitService,
        @Inject(MAT_DIALOG_DATA) public data: number) { }

    ngOnInit(): void {
        if (this.dialogRef.componentInstance.data !== null) {
            this.newVisit = new NewVisit();
            this.newVisit.patientId = this.dialogRef.componentInstance.data['patientId'];
            this.newVisit.entryCause = '';
            this.newVisit.responsibleId = null;
        }


        this.loadEntryEventTypes();
        this.loadSpecializations();

    }

    loadEntryEventTypes() {
        this.utilService.getEventTypes().then(events => {
            events.forEach(event => {
                if (event.superEventType && event.superEventType.id === 1)
                    this.eventTypes.push(event);
            })
        });
    }

    loadSpecializations() {
        this.utilService.getSpecialization().then(specs => {
            specs.forEach(spec => {
                this.specializations.push(spec);

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

}  