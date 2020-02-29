import { Component, OnInit, Inject } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ProfessionalService } from '../professional.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddressService } from 'app/core/address.service';
import { UtilService } from 'app/core/util.service';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';

export class Address {
  constructor() { }
  street: string = null;
  city: string = null;
  state: string = null;
  postalCode: string = null;
  addressNumber: string = null;
  complement: string = null;
  neighborhood: string = null;
}

export class Document {
  constructor(type) {
    this.type = type;
  }
  type: string; // CPF, CNPJ, PASSAPORTE, RNE
  value: string; // Valor do documento
}
export class Professional {
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
  selector: 'app-professional-edit',
  templateUrl: './professional-edit.component.html'
})
export class ProfessionalEditComponent implements OnInit {

  public professional: Professional;
  public loading: boolean;

  constructor(public confirmDialog: MatDialog,
    public dialogRef: MatDialogRef<ProfessionalEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Professional, private professionalService: ProfessionalService, private addressService: AddressService, private notification: NotificationsComponent, private utilService: UtilService) {
    this.dialogRef.disableClose = true;

    this.professional = new Professional();

  }

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.professional = new Professional();
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
      }).catch(error => {
        this.loading = false;
        var cpf = this.professional.document.value;
        this.professional = new Professional();
        this.professional.document.value = cpf;
        this.notification.showError("Não foi possível realizar a busca do paciente selecionado.")
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.professional.id) {
      this.professionalService.update(this.professional).then(resp => {
        this.professional = resp;
        if (!resp.address) {
          this.professional.address = new Address();
        }
        this.notification.showSucess("Paciente alterado com sucesso!");
      }).catch(error => {
        this.loading = false;
      });
    } else {
      this.professionalService.create(this.professional).then(resp => {
        this.professional = resp;
        if (!resp.address) {
          this.professional.address = new Address();
        }
        this.notification.showSucess("Paciente cadastrado com sucesso!");
      }).catch(error => {
        this.loading = false;
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
      if (!this.utilService.cpfIsValid(this.professional.document.value)) {
        this.loading = false;
        this.notification.showError("CPF Inválido, favor informar um CPF válido e sem pontos e/ou traços");
        this.professional = new Professional();
      } else {
        this.loading = true;
        this.professionalService.getByCpf(this.professional.document.value).then(resp => {
          this.loading = false;
          console.log(this.professional);
          this.professional = resp;
          if (!resp.address) {
            this.professional.address = new Address();
          }
        }).catch(error => {
          this.loading = false;
          var cpf = this.professional.document.value;
          this.professional = new Professional();
          this.professional.document.value = cpf;
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
      this.searchProfessionalByCpf();
    }
  }
}
