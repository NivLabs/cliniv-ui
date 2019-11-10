import { Component, OnInit, Inject } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { PatientService } from '../patient.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export class Address {
  constructor() { }
  street: string = null;
  city: string = null;
  state: string = null;
  postalCode: string = null;
  addressNumber: string = null;
  complement: string = null;
  district: string = null;
}

export class Document {
  constructor(type) {
    this.type = type;
  }
  type: string; // CPF, CNPJ, PASSAPORTE, RNE
  value: string; // Valor do documento
}
export class Patient {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  identity: string;
  dispatcher: string;
  document?: Document = new Document('CPF');
  address?: Address = new Address();
  principalNumber: string;
  secondaryNumber: string;
  bornDate: Date;
  observations: string;
  gender: string;
  email: string;
}

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html'
})
export class PatientEditComponent {

  private patient: Patient;
  public loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<PatientEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Patient) {
    this.dialogRef.disableClose = true;
    this.patient = new Patient();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
