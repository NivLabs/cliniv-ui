import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../user.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserInfo } from 'app/model/User';
import { AddressService } from 'app/core/address.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { Address } from 'app/model/Address';
import { CameraDialogComponent } from 'app/component/camera/dialog/camera-dialog.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {


  public dataToForm: UserInfo;
  public loading: boolean;
  public roles: Array<any>;

  constructor(public confirmDialog: MatDialog,
    public dialogRef: MatDialogRef<UserEditComponent>, public errorHandler: ErrorHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: UserInfo, private userService: UserService, private addressService: AddressService, private notification: NotificationsComponent, private utilService: UtilService) {
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
        this.roles = [
          { id: 1, name: 'ROLE_ADMIN', description: 'Administrador', checked: false },

          { id: 2, name: 'ROLE_ATENDIMENTO_LEITURA', description: 'Permissão de leitura em prontuário', checked: false },
          { id: 3, name: 'ROLE_ATENDIMENTO_ESCRITA', description: 'Permissão de escrita em prontuário', checked: false },

          { id: 4, name: 'ROLE_PACIENTE_LEITURA', description: 'Permissão de leitura em paciente', checked: false },
          { id: 5, name: 'ROLE_PACIENTE_ESCRITA', description: 'Permissão de escrita em paciente', checked: false },

          { id: 7, name: 'ROLE_PROFISSIONAL_LEITURA', description: 'Permissão de leitura em profissional', checked: false },
          { id: 8, name: 'ROLE_PROFISSIONAL_ESCRITA', description: 'Permissão de escrita em profissional', checked: false },

          { id: 9, name: 'ROLE_EVENTO_LEITURA', description: 'Permissão de leitura em evento', checked: false },
          { id: 10, name: 'ROLE_EVENTO_ESCRITA', description: 'Permissão de escrita em evento', checked: false },

          { id: 11, name: 'ROLE_SETOR_LEITURA', description: 'Permissão de leitura em setor', checked: false },
          { id: 12, name: 'ROLE_SETOR_ESCRITA', description: 'Permissão de escrita em setor', checked: false }

        ];
      }
    });
  }

  ngOnInit() {
    this.checkRoles()
    if (this.dialogRef.componentInstance.data['selectedId'] !== null) {
      this.loading = true;
      var selectedId = this.dialogRef.componentInstance.data['selectedId'];
      this.userService.getById(selectedId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        this.checkRoles();
      }).catch(error => {
        this.loading = false;
        var cpf = this.dataToForm.document.value;
        this.dataToForm = new UserInfo();
        this.dataToForm.document.value = cpf;
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
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

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dataToForm.roles = [];
    document.getElementsByName('roles').forEach(checkbox => {
      if (checkbox['checked']) {
        this.dataToForm.roles.push({ 'id': checkbox['id'], 'description': checkbox['value'] })
      }
    });

    if (this.dataToForm.id) {
      this.loading = true;
      this.userService.update(this.dataToForm).then(resp => {
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        this.loading = false;
        this.notification.showSucess("Paciente alterado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    } else {
      this.loading = true;
      this.userService.create(this.dataToForm).then(resp => {
        this.dataToForm = resp;
        if (!resp.address) {
          this.dataToForm.address = new Address();
        }
        this.loading = false;
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

  /**
   * TODO: Implementar pesquisa do lado da API
   */
  findByCpf() {
    if (!this.dataToForm.id && this.dataToForm.document.value)
      if (!this.utilService.cpfIsValid(this.dataToForm.document.value)) {
        this.notification.showError("CPF Inválido, favor informar um CPF válido e sem pontos e/ou traços");
        this.dataToForm = new UserInfo();
      } else {
        this.loading = true;
        this.userService.getByCpf(this.dataToForm.document.value).then(resp => {
          this.loading = false;
          this.dataToForm = resp;
          if (!resp.address) {
            this.dataToForm.address = new Address();
          }
          this.checkRoles()
        }).catch(error => {
          this.loading = false;
          var cpf = this.dataToForm.document.value;
          this.dataToForm = new UserInfo();
          this.dataToForm.document.value = cpf;
          this.errorHandler.handle(error, this.dialogRef);
        });
      }
  }

  resetPassword() {
    this.userService.resertPassword(this.dataToForm.id).then(() => {
      this.notification.showSucess("Senha alterada com sucesso!");
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, this.dialogRef);
    })
  }

  /**
   * Checa os papéis de acesso do usuário
   */
  checkRoles() {
    this.roles = [
      { id: 1, name: 'ROLE_ADMIN', description: 'Administrador', checked: false },

      { id: 2, name: 'ROLE_ATENDIMENTO_LEITURA', description: 'Permissão de leitura em prontuário', checked: false },
      { id: 3, name: 'ROLE_ATENDIMENTO_ESCRITA', description: 'Permissão de escrita em prontuário', checked: false },

      { id: 4, name: 'ROLE_PACIENTE_LEITURA', description: 'Permissão de leitura em paciente', checked: false },
      { id: 5, name: 'ROLE_PACIENTE_ESCRITA', description: 'Permissão de escrita em paciente', checked: false },

      { id: 7, name: 'ROLE_PROFISSIONAL_LEITURA', description: 'Permissão de leitura em profissional', checked: false },
      { id: 8, name: 'ROLE_PROFISSIONAL_ESCRITA', description: 'Permissão de escrita em profissional', checked: false },

      { id: 9, name: 'ROLE_EVENTO_LEITURA', description: 'Permissão de leitura em evento', checked: false },
      { id: 10, name: 'ROLE_EVENTO_ESCRITA', description: 'Permissão de escrita em evento', checked: false },

      { id: 11, name: 'ROLE_SETOR_LEITURA', description: 'Permissão de leitura em setor', checked: false },
      { id: 12, name: 'ROLE_SETOR_ESCRITA', description: 'Permissão de escrita em setor', checked: false }
    ];
    if (this.dataToForm && this.dataToForm.roles) {
      this.dataToForm.roles.forEach(role => {
        console.log("Checando papeis de acesso :: ", role['id'], " :: ", role['description']);
        this.roles.forEach(roleInput => {
          if (role['id'] === roleInput.id) {
            roleInput.checked = true;
          }
        });
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
