import { Component, Inject, OnInit } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { HealthPricingService } from '../health-pricing.service';
import { HealthPricingTable } from 'app/model/HealthPricingTable';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-health-pricing-edit',
  templateUrl: './health-pricing-edit.component.html',
  styleUrls: ['./health-pricing-edit.component.css']
})
export class HealthPricingEditComponent implements OnInit {

  public loading = false;
  public dataToForm: HealthPricingTable;

  constructor(
    public principalService: HealthPricingService,
    public dialogRef: MatDialogRef<HealthPricingEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent
  ) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new HealthPricingTable();
  }

  ngOnInit(): void {
    const selectedData = this.data ? this.data['selectedData'] : null;
    if (selectedData && selectedData.id) {
      this.dataToForm = { ...selectedData };
    }
  }

  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess('Tabela de preço alterada com sucesso!');
        this.dataToForm = resp;
      }).catch(error => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess('Tabela de preço cadastrada com sucesso!');
      }).catch(error => this.handlerException(error));
    }
  }

  delete() {
    if (confirm('Tem certeza que deseja deletar?')) {
      this.loading = true;
      this.principalService.delete(this.dataToForm.id).then(() => {
        this.loading = false;
        this.notification.showSucess('Tabela de preço deletada com sucesso!');
        this.dialogRef.close();
      }).catch(error => this.handlerException(error));
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  resetForm(): void {
    this.dataToForm = new HealthPricingTable();
  }

  private handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialogRef);
  }
}
