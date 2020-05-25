import { Component, OnInit, Inject } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorService } from '../sector.service';
import { UtilService } from 'app/core/util.service';
import { FormBuilder } from '@angular/forms';
import { Sector } from 'app/model/Sector';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sector-edit',
  templateUrl: './sector-edit.component.html'
})
export class SectorEditComponent implements OnInit {

  public loading = false;
  public dataToForm: Sector;

  constructor(public principalService: SectorService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<SectorEditComponent>, @Inject(MAT_DIALOG_DATA) public data: Sector, public formBuilder: FormBuilder, private utilService: UtilService, private patientService: SectorService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new Sector();
  }

  ngOnInit(): void {

    if (this.dialogRef.componentInstance.data['selectedSector'] !== null) {
      this.loading = true;
      var selectedSectorId = this.dialogRef.componentInstance.data['selectedSector'];
      this.principalService.getById(selectedSectorId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;        
      }).catch(error => {
        this.loading = false;       
        this.dataToForm = new Sector();        
        this.errorHandler.handle(error, this.dialogRef);
      });
    }


    /* if (this.dialogRef.componentInstance.data) {
      this.sector = this.dialogRef.componentInstance.data;
    } */
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.dataToForm = resp;
        this.notification.showSucess("Setor alterado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.dataToForm = resp;
        this.notification.showSucess("Setor cadastrado com sucesso!");
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
        this.dataToForm = new Sector();
      }
    });
  }
}
