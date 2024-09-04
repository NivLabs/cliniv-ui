import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SpecialityService } from '../speciality.service';
import { UtilService } from 'app/core/util.service';
import { UntypedFormBuilder } from '@angular/forms';
import { Speciality } from 'app/model/Speciality';
import { MatLegacyDialogRef as MatDialogRef, MatLegacyDialog as MatDialog, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-speciality-edit',
  templateUrl: './speciality-edit.component.html'
})
export class SpecialityEditComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public loading = false;
  public dataToForm: Speciality;
  public selectedSpecialityId: number = 0;

  constructor(public principalService: SpecialityService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<SpecialityEditComponent>, @Inject(MAT_DIALOG_DATA) public data: Speciality, public formBuilder: UntypedFormBuilder, private utilService: UtilService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new Speciality();
  }

  ngOnInit(): void {

    if (this.dialogRef.componentInstance.data['selectedSpeciality'] !== null || this.selectedSpecialityId !== 0) {
      this.loading = true;
      this.selectedSpecialityId = this.dialogRef.componentInstance.data['selectedSpeciality'];
      this.principalService.getById(this.selectedSpecialityId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;        
      }).catch(error => {
        this.dataToForm = new Speciality();
        this.handlerException(error);
      });

    }

  }

  /**
   * Fecha o dialog de edição de setor
   */
  onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * Cria ou atualiza um setor
   */
  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess("Especialidade alterada com sucesso!");
        this.dataToForm = resp;
      }).catch((error) => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.notification.showSucess("Especialidade cadastrada com sucesso!");
      }).catch((error) => this.handlerException(error));
    }
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
        this.dataToForm = new Speciality();
      }
    });
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
