import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MedicalRecordService } from '../medical-record.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { Page, Pageable } from 'app/model/Util';
import { Allergy, AllergyFilters, AllergiesDescriptions } from 'app/model/Allergy';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { fromEvent } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
    selector: 'app-allergy',
    templateUrl: './allergy.component.html',
    styleUrls: ['./allergy.component.css']
})

export class AllergyComponent implements OnInit {

    public loading = false;
    public loadingAutocomplete: boolean;
    public dataNotFound: boolean;
    public patientId: 0;
    allergies: AllergiesDescriptions;
    autocompleteAllergies: AllergiesDescriptions;
    allergyPage: Page;
    allergyFilters: AllergyFilters;
    allergyPageSettings: Pageable;

    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    allergyCtrl = new FormControl();

    private readonly RELOAD_TOP_SCROLL_POSITION = 30;
    @ViewChild('allergyInput', { static: true }) allergyInput: ElementRef;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    constructor(public principalService: MedicalRecordService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<AllergyComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Allergy, public formBuilder: FormBuilder, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() {

        if (this.dialogRef.componentInstance.data['patientId'] !== null) {
            //this.loading = true;           

            this.allergyPage = new Page();
            this.allergyFilters = new AllergyFilters();
            this.allergyPageSettings = new Pageable();
            this.autocompleteAllergies = new AllergiesDescriptions();
            this.allergies = new AllergiesDescriptions();
            this.allergyPageSettings.size = 6;

            this.patientId = this.dialogRef.componentInstance.data['patientId'];
            this.allergies.descriptions = this.dialogRef.componentInstance.data['allergies'];

            fromEvent(this.allergyInput.nativeElement, 'keyup').pipe(

                map((event: any) => {
                    return event.target.value;
                })
                , filter(res => res.length >= 0)

                , debounceTime(500)

                , distinctUntilChanged()

            ).subscribe((text: string) => {

                this.allergyFilters.description = text;

                if (this.allergyFilters.description) {
                    this.loadingAutocomplete = true;
                    this.allergyPageSettings.page = 0;
                    this.principalService.getPageAllergies(this.allergyFilters, this.allergyPageSettings).then(response => {
                        this.loadingAutocomplete = false;
                        this.autocompleteAllergies.descriptions = response.content.map((data: any) => data.description);
                        this.allergyPage = response;
                        this.dataNotFound = this.autocompleteAllergies.descriptions.length === 0;
                    }).catch(error => {
                        this.dataNotFound = this.dataNotFound !== undefined ? this.autocompleteAllergies.descriptions.length === 0 : true;
                        this.loadingAutocomplete = false;
                        this.errorHandler.handle(error, null);
                    });
                }
                else {
                    this.autocompleteAllergies.descriptions = [];
                }

            });
        }

    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.allergies.descriptions.push(value.trim());
        }

        if (input) {
            input.value = '';
        }

        this.allergyCtrl.setValue(null);
        this.autocompleteAllergies.descriptions = [];
    }

    remove(allergy: string): void {
        const index = this.allergies.descriptions.indexOf(allergy);

        if (index >= 0) {
            this.allergies.descriptions.splice(index, 1);
            this.autocompleteAllergies.descriptions = [];
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.allergies.descriptions.push(event.option.viewValue);
        this.allergyInput.nativeElement.value = '';
        this.allergyCtrl.setValue(null);
        this.autocompleteAllergies.descriptions = [];
    }

    loadAutoCompleteNextPage() {
        if (this.allergyPage && !this.allergyPage.last) {
            this.loadingAutocomplete = true;
            this.allergyPageSettings.page = this.allergyPageSettings.page + 1;
            this.principalService.getPageAllergies(this.allergyFilters, this.allergyPageSettings).then(response => {
                this.loadingAutocomplete = false;

                var arrayDescriptions = response.content.map((data: any) => data.description);

                arrayDescriptions.forEach(item => this.autocompleteAllergies.descriptions.push(item));
                
                this.allergyPage = response;
                this.dataNotFound = this.autocompleteAllergies.descriptions.length === 0;
            }).catch(error => {
                this.loadingAutocomplete = false;
                this.errorHandler.handle(error, null);
            })
        }
    }

    registerPanelScrollEvent() {
        const panel = document.querySelector('[id^="mat-autocomplete"]');
        panel.addEventListener('scroll', event => this.loadAllOnScroll(event));
    }

    loadAllOnScroll(event) {
        if (event.target.scrollTop > this.RELOAD_TOP_SCROLL_POSITION) {
            this.loadAutoCompleteNextPage();
        }
    }

    save() {
        const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
            data: { title: 'Confirmação', message: 'Confirma as alterações?' }
        });
        confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loading = true;
                this.principalService.saveAllergies(this.allergies, this.patientId).then(resp => {
                    this.loading = false;
                    this.notification.showSucess("Informações salvas com sucesso!");
                    this.dialogRef.close();
                }).catch(error => {
                    this.loading = false;
                    this.errorHandler.handle(error, this.dialogRef);
                });

            }
        });
    }

}
