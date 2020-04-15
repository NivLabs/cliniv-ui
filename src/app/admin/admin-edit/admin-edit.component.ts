import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from '../admin.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserInfo } from 'app/model/User';
import { AddressService } from 'app/core/address.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { Address } from 'app/model/Address';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {


  public dataToForm: UserInfo;
  public loading: boolean;

  constructor(public confirmDialog: MatDialog,
    public dialogRef: MatDialogRef<AdminEditComponent>, public errorHandler: ErrorHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: UserInfo, private adminService: AdminService, private addressService: AddressService, private notification: NotificationsComponent, private utilService: UtilService) {
    this.dialogRef.disableClose = true;

    this.dataToForm = new UserInfo();

  }

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm = new UserInfo();
      }
    });
  }

  ngOnInit() {
    if (this.dialogRef.componentInstance.data['selectedId'] !== null) {
      this.loading = true;
      var selectedId = this.dialogRef.componentInstance.data['selectedId'];
      this.adminService.getById(selectedId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
      }).catch(error => {
        this.loading = false;
        var cpf = this.dataToForm.document.value;
        this.dataToForm = new UserInfo();
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
      this.adminService.update(this.dataToForm).then(resp => {
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
      this.adminService.create(this.dataToForm).then(resp => {
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

  selectGender(newValue) {
    this.dataToForm.gender = newValue;
  }

  selectState(newValue) {
    this.dataToForm.address.state = newValue;
  }

  searchBy(type) {
    switch (type) {
      case 'CPF':
        this.findByCpf();
    }
  }

  findByCpf() {
    if (this.dataToForm.document.value)
      if (!this.utilService.cpfIsValid(this.dataToForm.document.value)) {
        this.notification.showError("CPF Inválido, favor informar um CPF válido e sem pontos e/ou traços");
        this.dataToForm = new UserInfo();
      } else {
        this.loading = true;
        this.adminService.getByCpf(this.dataToForm.document.value).then(resp => {
          this.loading = false;
          this.dataToForm = resp;
          if (!resp.address) {
            this.dataToForm.address = new Address();
          }
        }).catch(error => {
          this.loading = false;
          var cpf = this.dataToForm.document.value;
          this.dataToForm = new UserInfo();
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
      this.findByCpf();
    }
  }

}
