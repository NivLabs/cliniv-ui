import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/pt-br';
import { AttendanceService } from 'app/attendance/attendance.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { Accommodation } from 'app/model/Accommodation';
import { NewAttendance } from 'app/model/Attendance';
import { Professional } from 'app/model/Professional';
import { Sector, SectorFilters } from 'app/model/Sector';
import { Specialization } from 'app/model/Specialization';
import { Pageable } from 'app/model/Util';
import { SectorService } from 'app/sector/sector.service';
import { MedicalRecordService } from '../medical-record.service';


@Component({
    selector: 'app-new-attendance',
    templateUrl: './new-attendance.component.html'
})
export class NewAttendanceComponent implements OnInit {

    loading = false;

    eventTypeControl = new UntypedFormControl('', [Validators.required]);
    levelControl = new UntypedFormControl('', [Validators.required]);
    specializationControl = new UntypedFormControl('', [Validators.required]);
    sectorControl = new UntypedFormControl('', [Validators.required]);
    accommodationControl = new UntypedFormControl('', [Validators.required]);
    responsibleControl = new UntypedFormControl();

    specializationsData: Array<Specialization> = [];
    responsibles: Array<Professional> = [];
    sectors: Array<Sector> = [];
    accommodations: Array<Accommodation> = [];

    newVisit: NewAttendance;

    filters = new SectorFilters();
    pageSettings = new Pageable();

    constructor(
        public dialogRef: MatDialogRef<NewAttendanceComponent>,
        public attendanceService: AttendanceService,
        public sectorService: SectorService,
        public notification: NotificationsComponent,
        public utilService: UtilService,
        public visitService: MedicalRecordService,
        private errorHandler: ErrorHandlerService,
        @Inject(MAT_DIALOG_DATA) public data: number) { }

    ngOnInit(): void {

        if (this.dialogRef.componentInstance.data !== null) {
            this.newVisit = new NewAttendance();
            this.newVisit.patientId = this.dialogRef.componentInstance.data['patientId'];
            this.newVisit.entryCause = '';
            this.newVisit.level = 'LOW';
            this.newVisit.responsibleId = null;
            this.newVisit.eventType = "ENTRY";
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
        this.newVisit.specialityId = event.value;
        if (this.newVisit.specialityId) {
            this.loading = true;
            this.utilService.getSpecializationById(this.newVisit.specialityId).then(response => {
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
        this.newVisit.eventType = newValue;
    }

    selectLevel(newValue) {
        this.newVisit.level = newValue;
    }

    selectResponsible(newValue) {
        this.newVisit.responsibleId = newValue;
    }

    selectAccommodation(newValue) {
        this.newVisit.accommodationId = newValue;
    }

    onReady(editor) {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
    }

}