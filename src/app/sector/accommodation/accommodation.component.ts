import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorService } from '../sector.service';
import { UtilService } from 'app/core/util.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { Accommodation } from 'app/model/Accommodation';

@Component({
    selector: 'app-sector-edit',
    templateUrl: './accommodation.component.html'
})

export class AccommodationComponent implements OnInit {

    public loading = false;
    public dataForm: Accommodation;
    public sectorId: number;

    constructor(public principalService: SectorService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<AccommodationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Accommodation, public formBuilder: FormBuilder, private utilService: UtilService, private errorHandler: ErrorHandlerService,
        private notification: NotificationsComponent) {
        this.dialogRef.disableClose = true;
        this.dataForm = new Accommodation();
    }

    ngOnInit() {
        var data = this.dialogRef.componentInstance.data;
        if (data !== null && data.sectorId !== undefined) {
            this.loading = true;
            this.sectorId = this.dialogRef.componentInstance.data['sectorId'];
            this.dataForm.sectorId = this.sectorId;
            this.loading = false;
        }
        else {            
            this.loading = true;
            this.dataForm = this.dialogRef.componentInstance.data['accommodation'];
            this.loading = false;
        }
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    save() {
        if (this.dataForm.id) {
            this.principalService.updateAccommodation(this.dataForm).then(resp => {
                this.dataForm = resp;
                this.notification.showSucess("Acomodação alterada com sucesso!");
            }).catch(error => {
                this.loading = false;
                this.errorHandler.handle(error, this.dialogRef);
            });
        } else {
            this.principalService.createAccommodation(this.dataForm).then(resp => {
                this.dataForm = resp;
                this.notification.showSucess("Acomodação cadastrada com sucesso!");
            }).catch(error => {
                this.loading = false;
                this.errorHandler.handle(error, this.dialogRef);
            });
        }
    }

    resetForm() {
        const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
            data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
        });

        confirmDialogRef.afterClosed().subscribe(result => {
            if (result !== undefined && result.isConfirmed) {
                this.dataForm = new Accommodation();
                this.dataForm.sectorId = this.sectorId;
            }
        });
    }

    selectType(newValue) {
        this.dataForm.type = newValue;
    }

}
