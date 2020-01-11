import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { EventType, UtilService } from 'app/core/util.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Responsible, Specialization, Visit, VisitService, NewVisit } from '../visit.service';


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
            this.filteredEventTypesOptions = this.eventTypeControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterEventTypes(value))
            );
        });
    }

    loadSpecializations() {
        this.utilService.getSpecialization().then(specs => {
            specs.forEach(spec => {
                this.specializations.push(spec);

            });
            this.filteredSpecializationsOptions = this.specializationControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterSpecs(value))
            );
        });
    }

    loadResponsibles(id: number) {
        this.utilService.getSpecializationById(id).then(response => {
            this.responsibles = response.responsibles;
            this.filteredResponsiblesptions = this.responsibleControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filterResponsibles(value))
            );
        });
    }

    selectAutocompleOption(value: any, type: string) {

        switch (type) {
            case "EVENT":
                var id = value.split(' -')[0];
                this.newVisit.eventTypeId = id;
                break;
            case "SPEC":
                var id = value.split(' -')[0];
                if (id)
                    this.loadResponsibles(id);
                else
                    this.responsibles = [];
            case "RESP":
                var id = value.split(' -')[0];
                this.newVisit.responsibleId = id;
            default:
                break;
        }
    }

    private _filterEventTypes(value: string): EventType[] {
        const filterValue = value.toLowerCase();

        return this.eventTypes.filter(option => option.id.toString().toLowerCase().includes(value) || option.description.toLowerCase().includes(filterValue));
    }

    private _filterSpecs(value: string): Specialization[] {
        const filterValue = value.toLowerCase();

        return this.specializations.filter(option => option.id.toString().toLowerCase().includes(value) || option.name.toLowerCase().includes(filterValue));
    }

    private _filterResponsibles(value: string): Responsible[] {
        const filterValue = value.toLowerCase();

        return this.responsibles.filter(option => option.id.toString().toLowerCase().includes(value) || option.firstName.toLowerCase().includes(filterValue) || option.lastName.toLowerCase().includes(filterValue));
    }
}  