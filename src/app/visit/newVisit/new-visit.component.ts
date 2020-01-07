import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { pairs, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Visit, VisitService, Specialization, Responsible } from '../visit.service';
import { visitAll } from '@angular/compiler';
import { FormControl } from '@angular/forms';
import { UtilService, EventType } from 'app/core/util.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';

@Component({
    selector: 'app-new-visit',
    templateUrl: './new-visit.component.html'
})
export class NewVisitComponent implements OnInit {

    loading = false;

    eventTypeControl = new FormControl();
    specializationControl = new FormControl();
    responsibleControl = new FormControl();


    filteredEventTypesOptions: Observable<EventType[]>;
    filteredSpecializationsOptions: Observable<Specialization[]>;
    filteredResponsiblesptions: Observable<Responsible[]>;


    eventTypes: EventType[] = [];
    specializations: Specialization[] = [];
    responsibles: Responsible[] = [];

    specializationSelectedId: number;
    eventTypeSelectedId: number;
    newVisit: Visit;

    constructor(public dialogRef: MatDialogRef<NewVisitComponent>, public notification: NotificationsComponent, public utilService: UtilService, public visitService: VisitService,
        @Inject(MAT_DIALOG_DATA) public data: number) { }

    ngOnInit(): void {
        if (this.dialogRef.componentInstance.data !== null) {
            this.newVisit = new Visit();
            this.newVisit.id = this.dialogRef.componentInstance.data['patientId'];
            this.newVisit.entryCause = '';
            this.newVisit.responsibleId = undefined;
            this.newVisit.isFinished = false;
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
            this.filteredEventTypesOptions = this.eventTypeControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterEventTypes(value))
            );
        })
    }

    loadSpecializations() {

    }

    private _filterEventTypes(value: string): EventType[] {
        const filterValue = value.toLowerCase();

        return this.eventTypes.filter(option => option.id.toString().toLowerCase().includes(value) || option.description.toLowerCase().includes(filterValue));
    }

    private _filterSpecs(value: string): Specialization[] {
        const filterValue = value.toLowerCase();

        return this.specializations.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    private _filterResponsibles(value: string): Responsible[] {
        const filterValue = value.toLowerCase();

        return this.responsibles.filter(option => option.name.toLowerCase().includes(filterValue));
    }
}  