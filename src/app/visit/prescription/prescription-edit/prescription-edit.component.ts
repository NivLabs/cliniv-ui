import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { PrescriptionItem, } from 'app/model/Prescription';
import { UnitOfMeasurement, RouteOfAdministration, listOfUnitOfMeasurements as UNITS_OF_MEASUREMENTS } from 'app/model/Util';

@Component({
  selector: 'app-prescription-edit',
  templateUrl: './prescription-edit.component.html'
})
export class PrescriptionEditComponent implements OnInit {

  public dataToForm: PrescriptionItem;
  public listOfUnitOfMeasurement: Array<UnitOfMeasurement>;
  constructor(
    private dialogRef: MatDialogRef<PrescriptionEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: PrescriptionItem
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.listOfUnitOfMeasurement = UNITS_OF_MEASUREMENTS;
    if (this.dialogRef.componentInstance.data['prescriptionItem'] !== null) {
      this.dataToForm = this.dialogRef.componentInstance.data['prescriptionItem'];
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
