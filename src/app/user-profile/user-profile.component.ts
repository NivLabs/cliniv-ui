import { Component, OnInit } from '@angular/core';
import { UserProfileService, UserInfo, Document, Address } from './user-profile.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { FormGroup } from '@angular/forms';
import { AddressService, AddressFromAPI } from 'app/core/address.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  form: FormGroup;
  public loading: boolean;
  userInfo: UserInfo = new UserInfo;

  constructor(private profileService: UserProfileService, private addressService: AddressService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.userInfo = new UserInfo();
    this.loading = true;
    this.profileService.getMe().then(resp => {
      this.loading = false;
      this.userInfo = resp;
      if (!this.userInfo.document) {
        this.userInfo.document = new Document("CPF");
      }
      if (!this.userInfo.address) {
        this.userInfo.address = new Address();
      }
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  ngOnInit() {
  }

  save() {
    this.loading = true;
    this.profileService.save(this.userInfo).then(resp => {
      this.userInfo = resp;
      this.loading = false;
      this.notification.showSucess("Alteração realizada com sucesso!");
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  searchAddressByCEP() {
    this.loading = true;
    this.addressService.getAddressByCep(this.userInfo.address.postalCode).then(address => {
      this.loading = false;
      this.userInfo.address.city = address.localidade;
      this.userInfo.address.neighborhood = address.bairro;
      this.userInfo.address.state = address.uf;
      this.userInfo.address.street = address.logradouro;
    }).catch(error => {
      this.loading = false;
      this.notification.showWarning("Não foi possível realizar a busca do CEP, verifique se o mesmo está correto e continue o cadastro normalmente.")
    });
  }
  selectState(newValue) {
    this.userInfo.address.state = newValue;
  }
  selectGender(newValue) {
    this.userInfo.gender = newValue;
  }
}
