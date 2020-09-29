import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { HealthPlan } from 'app/model/HealthPlan';
import { HealthPlanService } from '../health-plan.service';

@Component({
  selector: 'app-health-plan',
  templateUrl: './health-plan.component.html',
  styleUrls: ['./health-plan.component.css']
})
export class HealthPlanComponent implements OnInit {

  public loading = false;
  public dataForm: HealthPlan;
  public operatorCode: string;

  constructor(public principalService: HealthPlanService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<HealthPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HealthPlan, public formBuilder: FormBuilder, private utilService: UtilService, private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    if (this.dialogRef.componentInstance.data['operatorCode'] !== undefined) {
      this.dataForm = new HealthPlan();
      this.operatorCode = this.dialogRef.componentInstance.data['operatorCode'];
      this.dataForm.operatorCode = this.operatorCode;
      this.loading = false;
    } else {
      this.dataForm = this.dialogRef.componentInstance.data['healthPlan'];
      this.loading = false;
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.dataForm.id) {
      this.principalService.update(this.dataForm).then(resp => {
        this.dataForm = resp;
        this.notification.showSucess("Plano de saúde alterada com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    } else {
      this.principalService.create(this.dataForm).then(resp => {
        this.dataForm = resp;
        this.notification.showSucess("Plano de saúde cadastrada com sucesso!");
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
        this.dataForm = new HealthPlan();
        this.dataForm.operatorCode = this.operatorCode;
      }
    });
  }

  selectType(newValue) {
    this.dataForm.type = newValue;
  }


}
