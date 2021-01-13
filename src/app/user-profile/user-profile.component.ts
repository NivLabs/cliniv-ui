import { Component, OnInit } from '@angular/core';
import { UserProfileService } from './user-profile.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { FormGroup } from '@angular/forms';
import { AddressService } from 'app/core/address.service';
import { UserInfo } from 'app/model/User';
import { Document } from 'app/model/Document';
import { Address } from 'app/model/Address';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CameraDialogComponent } from 'app/component/camera/dialog/camera-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  form: FormGroup;
  public loading: boolean;
  userInfo: UserInfo = new UserInfo;

  constructor(public confirmDialog: MatDialog, private profileService: UserProfileService, private addressService: AddressService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {

  }

  ngOnInit() {
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

  openWebCam() {
    const dialogRef = this.confirmDialog.open(CameraDialogComponent, {
      width: '500px',
      height: '548px',
    });

    dialogRef.afterClosed().subscribe(webCamImage => {
      if (webCamImage !== undefined) {
        this.userInfo.profilePhoto = webCamImage.imageAsDataUrl;
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
      t.userInfo.profilePhoto = 'data:image/png;base64,' + base64;
    };

    reader.readAsBinaryString(file);
  }

  openChangePasswordDialog() {
    const dialogRef = this.confirmDialog.open(ChangePasswordComponent, {
      width: '500px',
      height: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {

      }
    });
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
      this.userInfo.address = address;
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
