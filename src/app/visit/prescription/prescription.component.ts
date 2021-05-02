import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { MedicalRecord } from 'app/model/Attendance';
import { Prescription, PrescriptionItem } from 'app/model/Prescription';
import { MedicalRecordService } from '../medical-record.service';
import { PrescriptionEditComponent } from './prescription-edit/prescription-edit.component';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html'
})
export class PrescriptionComponent implements OnInit {

  public dataToForm: Prescription;
  public attendance: MedicalRecord;
  public dataSource: MatTableDataSource<PrescriptionItem>;
  public displayedColuns: any;
  public loading: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<PrescriptionComponent>,
    private errorHandler: ErrorHandlerService,
    private utilService: UtilService,
    private principalService: MedicalRecordService,
    private confirmDialog: MatDialog,
    private notification: NotificationsComponent,
    @Inject(MAT_DIALOG_DATA) private data: MedicalRecord,
    private dialog: MatDialog) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.dataToForm = new Prescription();
    this.displayedColuns = ["sequential", "description", "routeOfAdministration", "dosage", "unitOfMeasurement", "timeInterval", "actions"];
    this.dataSource = new MatTableDataSource(this.dataToForm.items);
    if (this.dialogRef.componentInstance.data['attendance'] !== null) {
      this.attendance = this.dialogRef.componentInstance.data['attendance'];
      this.dataToForm.attendanceId = this.attendance.id;
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * Calcula a idade de alguém baseado na data de nascimento
   * @param bornDate Data convertida em idade
   */
  getAge(bornDate: Date): number {
    return this.utilService.calculateAge(bornDate);
  }

  /**
   * Deleta item da prescrição
   * @param element Item da prescrição
   */
  deleteItem(element: PrescriptionItem): void {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você tem certeza que deseja apagar ' + element.description + 'da prescrição?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        for (var i = 0; i < this.dataToForm.items.length; i++) {
          if (this.dataToForm.items[i] == element) {
            this.dataToForm.items.splice(i--, 1);
            this.dataSource = new MatTableDataSource(this.dataToForm.items);
          }
        }
      }
    });
  }
  convertTimeIntervalType(type: string): string {
    switch (type) {
      case 'HOUR':
        return "h";
      case 'MINUTE':
        return "m";
      case 'DAY':
        return "d";
      case 'WEEK':
        return "sem";
      default:
        return "N/I";
    }
  }

  /**
   * Adiciona ou atualiza item da prescrição
   */
  addOrUpdate(element: PrescriptionItem): void {
    if (!element || !element.sequential) {
      element = new PrescriptionItem();
      element.sequential = this.dataToForm.items.length + 1;
    }
    const dialogRef = this.dialog.open(PrescriptionEditComponent, {
      width: '100%',
      height: 'auto',
      data: { prescriptionItem: element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.dataToForm.items.find(item => item.sequential == result.sequential)) {
          this.dataToForm.items.push(result);
          this.dataSource = new MatTableDataSource(this.dataToForm.items);
        }
      }
    })
  }

  /**
   * Cria uma prescrição médica no atendimento ativo
   */
  save() {
    this.loading = true;
    this.principalService.createPrescription(this.dataToForm).then(resp => {
      this.loading = false;
      this.notification.showSucess("Prescrição adicionada com sucesso");
      this.dialogRef.close();
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, this.dialogRef);
    });
  }

}
