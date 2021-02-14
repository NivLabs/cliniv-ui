import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { DynamicFormService } from 'app/visit/dynamicForm/dynamic-form.service';
import { UtilService } from 'app/core/util.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { DynamicFormItem } from 'app/model/DynamicFormItem';

@Component({
    selector: 'app-dynamic-form-question',
    templateUrl: './dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent implements OnInit {

    public loading = false;
    public dataForm: DynamicFormItem;
    public dynamicFormId: number;

    constructor(public principalService: DynamicFormService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<DynamicFormQuestionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DynamicFormItem, public formBuilder: FormBuilder, private utilService: UtilService, private errorHandler: ErrorHandlerService,
        private notification: NotificationsComponent) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() {
        var data = this.dialogRef.componentInstance.data;
        if (data !== null && data !== undefined) {
            this.dynamicFormId = this.dialogRef.componentInstance.data['dynamicFormId'];
            this.dataForm = this.dialogRef.componentInstance.data['dynamicFormQuestion'];
        }
        if (!this.dataForm) {
            this.dataForm = new DynamicFormItem();
        }
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    save() {
        this.loading = true;
        if (this.dataForm.id) {
            this.principalService.updateDynamicFormQuestion(this.dataForm).then(resp => {
                this.dataForm = resp;
                this.loading = false;
                this.notification.showSucess("Pergunta alterada com sucesso!");
            }).catch(error => {
                this.loading = false;
                this.errorHandler.handle(error, this.dialogRef);
            });
        } else {
            this.principalService.createDynamicFormQuestion(this.dataForm, this.dynamicFormId).then(resp => {
                this.dataForm = resp;
                this.loading = false;
                this.notification.showSucess("Pergunta cadastrada com sucesso!");
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
                this.dataForm = new DynamicFormItem();
            }
        });
    }

    selectType(newValue) {
        this.dataForm.metaType = newValue;
    }

}
