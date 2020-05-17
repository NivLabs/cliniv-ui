import { Component, OnInit, Inject } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ProfessionalService } from '../professional.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddressService } from 'app/core/address.service';
import { UtilService } from 'app/core/util.service';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Professional } from 'app/model/Professional';
import { Address } from 'app/model/Address';
import { ProfessionalIdentity } from 'app/model/ProfessionalIdentity';
import { CameraDialogComponent } from 'app/component/camera/dialog/camera-dialog.component';
import { Document } from 'app/model/Document';


@Component({
  selector: 'app-professional-edit',
  templateUrl: './professional-edit.component.html'
})
export class ProfessionalEditComponent implements OnInit {

  public form: FormGroup;
  public dataToForm: Professional;
  public loading: boolean;
  specializationsData: any;

  constructor(public confirmDialog: MatDialog, public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProfessionalEditComponent>, public errorHandler: ErrorHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: Professional, private professionalService: ProfessionalService, private addressService: AddressService, private notification: NotificationsComponent, private utilService: UtilService) {
    this.dialogRef.disableClose = true;

    this.dataToForm = new Professional();

    this.form = this.formBuilder.group({
      id: new FormControl(''),
      registerValue: new FormControl(''),
      registerType: new FormControl(''),
      document: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      motherName: new FormControl(''),
      fatherName: new FormControl(''),
      principalNumber: new FormControl(''),
      bornDate: new FormControl(''),
      gender: new FormControl(''),
      cep: new FormControl(''),
      street: new FormControl(''),
      addressNumber: new FormControl(''),
      complement: new FormControl(''),
      neighborhood: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl('')
    })
    this.form.controls.id.disable();

  }

  openWebCam() {
    const dialogRef = this.confirmDialog.open(CameraDialogComponent, {
      width: '500px',
      height: '548px',
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
        this.dataToForm = new Professional();
        this.form.controls.document.enable();
      }
    });
  }

  ngOnInit() {
    if (this.dialogRef.componentInstance.data['selectedProfessional'] !== null) {
      this.loading = true;
      var selectedProfessionalId = this.dialogRef.componentInstance.data['selectedProfessional'];
      this.professionalService.getById(selectedProfessionalId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        if (this.dataToForm.document) {
          this.form.controls.document.disable();
        }
        this.loadspecializationsData();
      }).catch(error => {
        this.loading = false;
        var cpf = this.dataToForm.document.value;
        this.form.controls.document.enable();
        this.dataToForm = new Professional();
        this.dataToForm.document.value = cpf;
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  loadspecializationsData() {
    this.specializationsData = [];
    this.utilService.getSpecialization().then(specs => {
      this.specializationsData = specs;
      this.checkSpecializations();
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dataToForm.specializations = [];
    document.getElementsByName('specializations').forEach(specInput => {
      if (specInput['checked']) {
        this.dataToForm.specializations.push({ id: specInput['id'], name: specInput['value'] })
      }
    });
    if (this.dataToForm.id) {
      this.professionalService.update(this.dataToForm).then(resp => {
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        this.notification.showSucess("Profissional alterado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    } else {
      this.professionalService.create(this.dataToForm).then(resp => {
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        this.notification.showSucess("Profissional cadastrado com sucesso!");
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

  selectGender(newValue) {
    this.dataToForm.gender = newValue;
  }

  selectState(newValue) {
    this.dataToForm.address.state = newValue;
  }

  cpfIsValid() {
    if (this.dataToForm.document) {
      if (this.dataToForm.document.value === "" || this.dataToForm.document.value === undefined)
        return true
      return this.utilService.cpfIsValid(this.dataToForm.document.value);
    }
    return false
  }

  searchProfessionalByCpf() {
    if (!this.cpfIsValid()) {
      this.notification.showWarning("CPF Inválido, favor informar um CPF válido e sem pontos e/ou traços");
      this.dataToForm.document = new Document("CPF");
    } else {
      this.loading = true;
      this.professionalService.getByCpf(this.dataToForm.document.value).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        if (!resp.professionalIdentity) {
          this.dataToForm.professionalIdentity = new ProfessionalIdentity('CRM');
        }
        this.form.controls.document.disable();
        this.loadspecializationsData();
      }).catch(error => {
        this.loading = false;
        this.dataToForm.document = new Document('CPF');
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  checkSpecializations() {
    this.dataToForm.specializations.forEach(spec => {
      console.log("Checando especialização :: ", spec.id, " :: ", spec.name);
      this.specializationsData.forEach(specInput => {
        if (spec.id === specInput.id) {
          specInput.checked = true;
        }
      });
    });
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
      this.searchProfessionalByCpf();
    }
  }
}
