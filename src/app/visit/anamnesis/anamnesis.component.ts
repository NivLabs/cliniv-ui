import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MedicalRecordService } from '../medical-record.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { AnamnesisItem } from 'app/model/AnamnesisItem';
import { Page, Pageable } from 'app/model/Util';
import { Response } from 'app/model/Response';
import { ResponseAnamnesis } from 'app/model/ResponseAnamnesis';

@Component({
    selector: 'app-anamnesis',
    templateUrl: './anamnesis.component.html'
})

export class AnamnesisComponent implements OnInit {

    public loading = false;
    public responseAnamnesis: ResponseAnamnesis;
    public dataNotFound: boolean;
    datas: Array<Response> = [];
    page: Page;
    pageSettings: Pageable;

    constructor(public principalService: MedicalRecordService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<AnamnesisComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AnamnesisItem, public formBuilder: FormBuilder, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() {

        if (this.dialogRef.componentInstance.data['visitId'] !== null) {
            this.loading = true;
            this.page = new Page();
            this.pageSettings = new Pageable();
            this.pageSettings.size = 100;
            this.responseAnamnesis = new ResponseAnamnesis();
            this.responseAnamnesis.attendanceId = this.dialogRef.componentInstance.data['visitId'];

            this.principalService.getPageOfQuestions(this.pageSettings).then(resp => {
                this.loading = false;
                resp.content.forEach(item => {
                    var response = new Response();
                    response.anamnesisItem = item;
                    this.datas.push(response);
                })
                this.responseAnamnesis.listOfResponse = this.datas;
                this.page = resp;
                this.dataNotFound = this.datas.length === 0;
            }).catch(error => {
                this.dataNotFound = this.datas ? this.datas.length === 0 : true;
                this.loading = false;
                this.errorHandler.handle(error, null);
            });
        }
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    save() {
        this.responseAnamnesis.listOfResponse = this.responseAnamnesis.listOfResponse.filter(x => x.response != "" && x.response != null);

        this.principalService.createAnamnesis(this.responseAnamnesis).then(resp => {            
            this.notification.showSucess("Anamnese inserida com sucesso!");
            this.dialogRef.close();
        }).catch(error => {
            this.loading = false;
            this.errorHandler.handle(error, this.dialogRef);
        });

    }

    formValid(){

        return !this.responseAnamnesis.listOfResponse.some(x => x.response != "" && x.response != null);

    }

}
