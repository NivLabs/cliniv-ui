import { Component, OnInit, Inject } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ProfessionalService } from '../professional.service';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AddressService } from 'app/core/address.service';
import { UtilService } from 'app/core/util.service';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormArray } from '@angular/forms';
import { Professional } from 'app/model/Professional';
import { Address } from 'app/model/Address';
import { ProfessionalIdentity } from 'app/model/ProfessionalIdentity';
import { CameraDialogComponent } from 'app/component/camera/dialog/camera-dialog.component';
import { Document } from 'app/model/Document';
import { Specialization } from 'app/model/Specialization';


@Component({
  selector: 'app-professional-edit',
  templateUrl: './professional-edit.component.html'
})
export class ProfessionalEditComponent implements OnInit {

  public form: UntypedFormGroup;
  public dataToForm: Professional;
  public loading: boolean;
  specializationsData: any;

  constructor(public confirmDialog: MatDialog, public formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ProfessionalEditComponent>, public errorHandler: ErrorHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: Professional, private professionalService: ProfessionalService, private addressService: AddressService, private notification: NotificationsComponent, private utilService: UtilService) {
    this.dialogRef.disableClose = true;

    this.dataToForm = new Professional();

    this.form = this.formBuilder.group({
      id: new UntypedFormControl(''),
      registerValue: new UntypedFormControl(''),
      registerType: new UntypedFormControl(''),
      document: new UntypedFormControl(''),
      fullName: new UntypedFormControl(''),
      socialName: new UntypedFormControl(''),
      motherName: new UntypedFormControl(''),
      fatherName: new UntypedFormControl(''),
      principalNumber: new UntypedFormControl(''),
      secondaryNumber: new UntypedFormControl(''),
      bornDate: new UntypedFormControl(''),
      gender: new UntypedFormControl(''),
      cep: new UntypedFormControl(''),
      street: new UntypedFormControl(''),
      addressNumber: new UntypedFormControl(''),
      complement: new UntypedFormControl(''),
      neighborhood: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      email: new UntypedFormControl(''),
      state: new UntypedFormControl('')
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

  saveImagem(fileInputEvent: any) {

    var t = this;
    var file = fileInputEvent.target.files[0];

    var reader = new FileReader();

    reader.onload = function (readerEvt) {
      var binaryString = readerEvt.target.result.toString();
      var base64 = btoa(binaryString);
      t.dataToForm.profilePhoto = 'data:image/png;base64,' + base64;
    };

    reader.readAsBinaryString(file);
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
        if (!resp.professionalIdentity) {
          this.dataToForm.professionalIdentity = new ProfessionalIdentity();
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
      this.specializationsData = specs.content;
      this.checkSpecializations();
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.dataToForm.id) {
      this.loading = true;
      this.professionalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        if (!resp.professionalIdentity) {
          this.dataToForm.professionalIdentity = new ProfessionalIdentity();
        }
        if (!resp.document) {
          this.dataToForm.document = new Document('CPF');
        }
        this.form.controls.document.disable();

        this.notification.showSucess("Profissional alterado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    } else {
      this.loading = true;
      this.professionalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        if (!resp.professionalIdentity) {
          this.dataToForm.professionalIdentity = new ProfessionalIdentity();
        }
        if (!resp.document) {
          this.dataToForm.document = new Document('CPF');
        }
        this.form.controls.document.disable();

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
          this.dataToForm.professionalIdentity = new ProfessionalIdentity();
        }
        if (!resp.document) {
          this.dataToForm.document = new Document('CPF');
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
      this.specializationsData.forEach(specInput => {
        if (spec.id === specInput.id) {
          specInput.checked = true;
        }
      });
    });
  }

  checkItem(checked: Specialization) {
    var exists = false;
    this.dataToForm.specializations.forEach(spec => {
      if (spec.id == checked.id) {
        exists = true;
        return;
      }
    });
    if (exists) {
      this.dataToForm.specializations = this.dataToForm.specializations.filter(spec => spec.id != checked.id);
    } else {
      this.dataToForm.specializations.push(checked);
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
      this.searchProfessionalByCpf();
    }
  }
}
