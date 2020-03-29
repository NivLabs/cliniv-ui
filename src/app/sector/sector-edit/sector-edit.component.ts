import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorService } from '../sector.service';
import { UtilService } from 'app/core/util.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Sector } from 'app/model/Sector';

@Component({
  selector: 'app-sector-edit',
  templateUrl: './sector-edit.component.html'
})
export class SectorEditComponent implements OnInit {

  public loading = false;
  public sector: Sector;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<SectorEditComponent>, public formBuilder: FormBuilder, private utilService: UtilService, private patientService: SectorService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.sector = new Sector(null, null);
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {

  }

  resetForm() {

  }
}
