import { Component, OnInit } from '@angular/core';
import { UpdatePassword } from 'app/model/UpdatePassword';
import { MatDialogRef } from '@angular/material/dialog';
import { UserProfileService } from '../user-profile.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {


  dataToForm: UpdatePassword;

  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>, private service: UserProfileService, public errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.dataToForm = new UpdatePassword();
  }

  onChangePassword() {
    this.service.changePassword(this.dataToForm)
      .then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this));
  }

  onSuccess() {
    this.notification.showSucess("Senha alterada com sucesso!");
    this.dialogRef.close();
  }

  onError(error) {
    console.log(this)
    this.errorHandler.handle(error, this.dialogRef);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  enterKeyPress(event: any) {
    // Windows
    if (event.key === "Enter") {
      this.onChangePassword();
    }
  }


}
