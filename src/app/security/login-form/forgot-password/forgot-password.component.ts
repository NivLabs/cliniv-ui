import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ForgotPasswordRequest } from 'app/model/ForgotPasswordRequest';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private authService: AuthService,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent
  ) { }

  dataToForm: ForgotPasswordRequest;
  confirmNewPassword: string;
  public loading: boolean = false;

  ngOnInit(): void {
    this.dataToForm = new ForgotPasswordRequest();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  forgotPassword(): void {
    if (this.dataToForm.newPassword !== this.confirmNewPassword) {
      this.errorHandler.handle('As senhas informadas não coincidem!', null);
      return;
    }

    this.loading = true;
    this.authService.forgotPassword(this.dataToForm)
      .then(() => {
        this.notification.showSucess('Senha alterada com sucesso!');
        this.dialogRef.close();
      })
      .catch(error => this.errorHandler.handle(error, null))
      .then(() => this.loading = false);
  }

}
