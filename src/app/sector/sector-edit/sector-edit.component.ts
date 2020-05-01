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
  public sector: Sector;

  constructor(public sectorService: SectorService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<SectorEditComponent>, @Inject(MAT_DIALOG_DATA) public data: Sector, public formBuilder: FormBuilder, private utilService: UtilService, private patientService: SectorService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.sector = new Sector(null, null, null);
  }

  ngOnInit(): void {
    if (this.dialogRef.componentInstance.data) {
      this.sector = this.dialogRef.componentInstance.data;
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.sector.id) {
      this.sectorService.update(this.sector).then(resp => {
        this.sector = resp;
        this.notification.showSucess("Setor alterado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    } else {
      this.sectorService.create(this.sector).then(resp => {
        this.sector = resp;
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
        this.sector = new Sector(null, null, null);
      }
    });
  }
}
