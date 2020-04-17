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


@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html'
})
export class PatientEditComponent implements OnInit {

  public dataToForm: PatientInfo;
  public loading: boolean;

  constructor(private router: Router, public confirmDialog: MatDialog,
    public dialogRef: MatDialogRef<PatientEditComponent>, public errorHandler: ErrorHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: PatientInfo, private patientService: PatientService, private addressService: AddressService, private notification: NotificationsComponent, private utilService: UtilService) {
    this.dialogRef.disableClose = true;

    this.dataToForm = new PatientInfo();

  }


  openWebCam() {
    const dialogRef = this.confirmDialog.open(CameraDialogComponent, {
      width: '460px',
      height: '6850px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm.avatar = result.webCamImage.imageAsBase64;
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
      this.dataToForm.address.city = address.localidade;
      this.dataToForm.address.neighborhood = address.bairro;
      this.dataToForm.address.state = address.uf;
      this.dataToForm.address.street = address.logradouro;
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

  selectState(newValue) {
    this.dataToForm.address.state = newValue;
  }

  searchPatientByCpf() {
    if (this.dataToForm.document.value)
      if (!this.utilService.cpfIsValid(this.dataToForm.document.value)) {
        this.notification.showError("CPF Inválido, favor informar um CPF válido e sem pontos e/ou traços");
        this.dataToForm = new PatientInfo();
      } else {
        this.loading = true;
        this.patientService.getByCpf(this.dataToForm.document.value).then(resp => {
          this.loading = false;
          this.dataToForm = resp;
          if (!resp.address) {
            this.dataToForm.address = new Address();
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

  /**
   * 
   * Executa um evento à partir da tecla enter
   * 
   * @param event Evento de tecla
   */
  enterKeyPress(event: any) {
    // Windows
    if (event.key === "Enter") {
      this.searchPatientByCpf();
    }
  }
}
