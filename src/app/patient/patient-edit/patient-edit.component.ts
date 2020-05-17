import { Component, OnInit, Inject } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { PatientService } from '../patient.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddressService } from 'app/core/address.service';
import { UtilService } from 'app/core/util.service';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { PatientInfo } from 'app/model/Patient';
import { Address } from 'app/model/Address';
import { WebcamImage } from 'ngx-webcam';
import { CameraDialogComponent } from 'app/component/camera/dialog/camera-dialog.component';
import { Document } from 'app/model/Document';


@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html'
})
export class PatientEditComponent implements OnInit {

  public dataToForm: PatientInfo;
  public loading: boolean;
  public isNewCpf = false;

  constructor(private router: Router, public confirmDialog: MatDialog,
    public dialogRef: MatDialogRef<PatientEditComponent>, public errorHandler: ErrorHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: PatientInfo, private patientService: PatientService, private addressService: AddressService, private notification: NotificationsComponent, private utilService: UtilService) {
    this.dialogRef.disableClose = true;

    this.dataToForm = new PatientInfo();

  }


  openWebCam() {
    const dialogRef = this.confirmDialog.open(CameraDialogComponent, {
      width: '500px',
      height: '548px'
    });

    dialogRef.afterClosed().subscribe(webCamImage => {
      if (webCamImage !== undefined) {
        this.dataToForm.profilePhoto = webCamImage.imageAsDataUrl;
      }
    });
  }

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm = new PatientInfo();
      }
    });
  }

  ngOnInit() {
    if (this.dialogRef.componentInstance.data['selectedPatient'] !== null) {
      this.loading = true;
      var selectedPatientId = this.dialogRef.componentInstance.data['selectedPatient'];
      this.patientService.getById(selectedPatientId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        if (!resp.document) {
          this.isNewCpf = true;
          this.dataToForm.document = new Document('CPF');
        }
      }).catch(error => {
        this.loading = false;
        var cpf = this.dataToForm.document.value;
        this.dataToForm = new PatientInfo();
        this.dataToForm.document.value = cpf;
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.dataToForm.id) {
      this.patientService.update(this.dataToForm).then(resp => {
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        this.notification.showSucess("Paciente alterado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    } else {
      this.patientService.create(this.dataToForm).then(resp => {
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        this.notification.showSucess("Paciente cadastrado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  searchAddressByCEP() {
    this.loading = true;
    this.addressService.getAddressByCep(this.dataToForm.address.postalCode).then(address => {
      this.loading = false;
      this.dataToForm.address = address;
    }).catch(error => {
      this.loading = false;
      this.notification.showWarning("Não foi possível realizar a busca do CEP, verifique se o mesmo está correto e continue o cadastro normalmente.")
    });
  }

  gotToVisit() {
    this.dialogRef.close();
    this.router.navigate(['visit', { patientId: this.dataToForm.id }]);
  }

  selectGender(newValue) {
    this.dataToForm.gender = newValue;
  }

  selectGenderIdeology(newValue) {
    this.dataToForm.genderIdeology = newValue;
  }

  selectState(newValue) {
    this.dataToForm.address.state = newValue;
  }

  selectPatientType(newValue) {
    this.dataToForm.type = newValue;
  }

  cpfIsValid() {
    if (this.dataToForm.document) {
      if (this.dataToForm.document.value === "" || this.dataToForm.document.value === undefined)
        return true
      return this.utilService.cpfIsValid(this.dataToForm.document.value);
    }
    return false
  }

  searchPatientByCpf() {
    if (!this.cpfIsValid()) {
      this.notification.showWarning("CPF Inválido, favor informar um CPF válido e sem pontos e/ou traços");
      this.dataToForm.document = new Document("CPF");
    } else {
      this.loading = true;
      this.patientService.getByDocument('CPF', this.dataToForm.document.value).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
      }).catch(error => {
        this.loading = false;
        this.dataToForm.document = new Document('CPF');
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  searchPatientBySusNumber() {
    if (this.dataToForm.susNumber) {
      this.loading = true;
      this.patientService.getByDocument('SUS', this.dataToForm.susNumber).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
      }).catch(error => {
        this.loading = false;
        this.dataToForm.susNumber = "";
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  /**
   * 
   * Executa um evento à partir da tecla enter
   * 
   * @param event Evento de tecla
   */
  enterKeyPress(event: any, handler: string) {
    // Windows
    if (event.key === "Enter") {
      event.preventDefault();
      if (handler === "searchCPF")
        this.searchPatientByCpf();
      if (handler === "searchSUS")
        this.searchPatientBySusNumber();
    }
  }
}
