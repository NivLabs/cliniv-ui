import { Component, OnInit, Inject } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MedicalRecordService } from '../medical-record.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { Page, Pageable } from 'app/model/Util';
import { Allergy } from 'app/model/Allergy';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'app-allergy',
    templateUrl: './allergy.component.html'
})

export class AllergyComponent implements OnInit {

    public loading = false;
    public dataNotFound: boolean;
    public patientId: 0;
    datas: Array<Allergy> = [];
    page: Page;
    pageSettings: Pageable;

    constructor(public principalService: MedicalRecordService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<AllergyComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Allergy, public formBuilder: FormBuilder, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent,
        private http: HttpClient) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() {

        if (this.dialogRef.componentInstance.data['patientId'] !== null) {
            this.loading = true;
            this.page = new Page();
            this.pageSettings = new Pageable();
            this.pageSettings.size = 100;
            this.patientId = this.dialogRef.componentInstance.data['patientId'];

            // buscar alergias do paciente
            /* this.principalService.getPageOfQuestions(this.pageSettings).then(resp => {
                this.loading = false;
                this.page = resp;
                this.datas = resp.content;
                this.dataNotFound = this.datas.length === 0;
            }).catch(error => {
                this.dataNotFound = this.datas ? this.datas.length === 0 : true;
                this.loading = false;
                this.errorHandler.handle(error, null);
            }); */
        }
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    requestAutocompleteItems = (text: string): Observable<any> => {
        const url = `https://api.github.com/search/repositories?q=${text}`;
        return this.http
            .get(url)
            .map((data: any) => data.items.map(item => item.full_name));
    };

    onRemoving(tag: any): Observable<any> {

        var confirm = false;

        const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
            data: { title: 'Confirmação', message: 'Tem certeza que quer remover essa alergia?' }
        });
        confirmDialogRef.afterClosed().subscribe(result => {
            if (result)
                confirm = true;
        });

        return Observable
                    .of(tag)
                    .filter(() => confirm);

    };

}
