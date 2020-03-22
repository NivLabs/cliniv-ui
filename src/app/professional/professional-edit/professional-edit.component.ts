import { Component, OnInit, Inject } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ProfessionalService, Professional, Address, ProfessionalIdentity } from '../professional.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddressService } from 'app/core/address.service';
import { UtilService } from 'app/core/util.service';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';


@Component({
  selector: 'app-professional-edit',
  templateUrl: './professional-edit.component.html'
})
export class ProfessionalEditComponent implements OnInit {

  public form: FormGroup;
  public professional: Professional;
  public loading: boolean;
  specializationsData: any;

  constructor(public confirmDialog: MatDialog, public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProfessionalEditComponent>, public errorHandler: ErrorHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: Professional, private professionalService: ProfessionalService, private addressService: AddressService, private notification: NotificationsComponent, private utilService: UtilService) {
    this.dialogRef.disableClose = true;

    this.professional = new Professional();

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

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.professional = new Professional();
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
        this.professional = resp;
        if (!resp.address) {
          this.professional.address = new Address();
        }
        if (this.professional.document) {
          this.form.controls.document.disable();
        }
        this.loadspecializationsData();
      }).catch(error => {
        this.loading = false;
        var cpf = this.professional.document.value;
        this.form.controls.document.enable();
        this.professional = new Professional();
        this.professional.document.value = cpf;
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
    this.professional.specializations = [];
    document.getElementsByName('specializations').forEach(specInput => {
      if (specInput['checked']) {
        this.professional.specializations.push({ id: specInput['id'], name: specInput['value'] })
      }
    });
    if (this.professional.id) {
      this.professionalService.update(this.professional).then(resp => {
        this.professional = resp;
        if (!resp.address) {
          this.professional.address = new Address();
        }
        this.notification.showSucess("Profissional alterado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    } else {
      this.professionalService.create(this.professional).then(resp => {
        this.professional = resp;
        if (!resp.address) {
          this.professional.address = new Address();
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
    this.addressService.getAddressByCep(this.professional.address.postalCode).then(address => {
      this.loading = false;
      this.professional.address.city = address.localidade;
      this.professional.address.neighborhood = address.bairro;
      this.professional.address.state = address.uf;
      this.professional.address.street = address.logradouro;
    }).catch(error => {
      this.loading = false;
      this.notification.showWarning("Não foi possível realizar a busca do CEP, verifique se o mesmo está correto e continue o cadastro normalmente.")
    });
  }

  selectGender(newValue) {
    this.professional.gender = newValue;
  }

  selectState(newValue) {
    this.professional.address.state = newValue;
  }

  searchProfessionalByCpf() {
    if (this.professional.document.value)
      if (!this.utilService.cpfIsValid(this.professional.document.value)) {
        this.loading = false;
        this.notification.showError("CPF Inválido, favor informar um CPF válido e sem pontos e/ou traços");
        this.professional = new Professional();
      } else {
        this.loading = true;
        this.professionalService.getByCpf(this.professional.document.value).then(resp => {
          this.loading = false;
          this.professional = resp;
          if (!resp.address) {
            this.professional.address = new Address();
          }
          if (!resp.professionalIdentity) {
            this.professional.professionalIdentity = new ProfessionalIdentity('CRM');
          }
          this.form.controls.document.disable();
          this.loadspecializationsData();
        }).catch(error => {
          this.loading = false;
          var cpf = this.professional.document.value;
          this.form.controls.document.enable();
          this.professional = new Professional();
          this.professional.document.value = cpf;
          this.errorHandler.handle(error, this.dialogRef);
        });
      }
  }

  checkSpecializations() {
    this.professional.specializations.forEach(spec => {
      console.log("Chegando especialização :: ", spec.id, " :: ", spec.name);
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
