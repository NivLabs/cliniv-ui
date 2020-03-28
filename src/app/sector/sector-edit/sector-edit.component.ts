import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorService } from '../sector.service';
import { UtilService } from 'app/core/util.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Sector } from 'app/model/Sector';

@Component({
  selector: 'app-sector-edit',
  templateUrl: './sector-edit.component.html',
  styleUrls: ['./sector-edit.component.css']
})
export class SectorEditComponent implements OnInit {


  public form: FormGroup;
  public loading = false;
  public sector: Sector;

  constructor(public dialog: MatDialog, public formBuilder: FormBuilder, private utilService: UtilService, private patientService: SectorService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.sector = new Sector(null, null);

    this.form = this.formBuilder.group({
      id: new FormControl(''),
      description: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

}
