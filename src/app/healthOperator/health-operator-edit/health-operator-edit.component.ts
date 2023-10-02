import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { HealthOperator } from 'app/model/HealthOperator';
import { HealthPlan } from 'app/model/HealthPlan';
import { HealthOperatorService } from '../health-operator.service';
import { HealthPlanService } from '../health-plan.service';
import { HealthPlanComponent } from '../health-plan/health-plan.component';

@Component({
  selector: 'app-health-operator-edit',
  templateUrl: './health-operator-edit.component.html',
  styleUrls: ['./health-operator-edit.component.css']
})
export class HealthOperatorEditComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public loading = false;
  public dataToForm: HealthOperator;
  public dataSource: any;
  public displayedColumns: any;
  public selectedId: number = 0;

  constructor(public principalService: HealthOperatorService,
    public healthPlanService: HealthPlanService,
    public confirmDialog: MatDialog,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<HealthOperatorEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HealthOperator,
    public formBuilder: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent) {

    this.dialogRef.disableClose = true;
    this.dataToForm = new HealthOperator();
  }

  ngOnInit(): void {
    if (this.dialogRef.componentInstance.data['selectedId'] !== null || this.selectedId !== 0) {
      this.loading = true;
      this.selectedId = this.dialogRef.componentInstance.data['selectedId'];
      this.principalService.getById(this.selectedId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.dataToForm.healthPlans = this.dataToForm.healthPlans.sort(function (a, b) {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        });
        this.dataSource = new MatTableDataSource(this.dataToForm.healthPlans);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
      }).catch(error => {
        this.loading = false;
        this.dataToForm = new HealthOperator();
        this.handlerException(error);
      });

      this.displayedColumns = ['id', 'planCode', 'commercialName', 'contractType', 'actions'];
    }
  }



  /**
   * Abre o formulário de edição de plano de saúde
   * 
   * @param healthPlan Plano de Saúde
   */
  openEditHealthPlanDialog(healthPlan: HealthPlan): void {
    healthPlan.operatorCode = this.dataToForm.ansCode;
    const dialogRef = this.dialog.open(HealthPlanComponent, {
      width: '100%',
      height: 'auto',
      data: { healthPlan: healthPlan }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });

  }

  /**
   * Deleta plano de saúde inutilizado
   * 
   * @param healthPlan Plano de saúde à ser excluído
   */
  openDeleteHealthPlanDialog(id: number) {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a exclusão do plano de saúde?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.healthPlanService.delete(id).then(resp => {
          this.ngOnInit();
          this.notification.showSucess("Plano de saúde excluído com sucesso!");
        }).catch((error) => this.handlerException(error));
      }
    });
  }

  /**
  * Abre o dialog de plano de saúde com identificador único da operadora para criação
  * 
  * @param sectorId Identificador único do setor
  */
  openNewHealthPlanDialog(operatorCode: string): void {

    const dialogRef = this.dialog.open(HealthPlanComponent, {
      width: '100%',
      height: 'auto',
      data: { operatorCode: operatorCode }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });

  }

  /**
   * Limpa o formulário
   */
  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm = new HealthOperator();
        this.dataToForm.healthPlans = new Array<HealthPlan>();
      }
    });
  }

  showContractTypeDescription(contractType: string) {
    switch (contractType) {
      case 'BUSINESS_COLLECTIVE':
        return 'Coletivo Empresarial';
      case 'MEMBERSHIP_COLLECTIVE':
        return 'Coletivo por Adeção'
      case 'INDIVIDUAL_OR_FAMILY':
        return 'Individual ou Familiar';
    }
  }

  /**
   * Cria ou atualiza uma operadora
   */
  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess("Operadora alterada com sucesso!");
        this.dataToForm = resp;
      }).catch((error) => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess("Operadora cadastrada com sucesso!");
      }).catch((error) => this.handlerException(error));
    }
  }

  /**
   * Fecha o componente
   */
  onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * 
   * @param error Trata exception padrão
   */
  handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialogRef);
  }

}
