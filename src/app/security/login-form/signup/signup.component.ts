import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { NewCustomerRequest } from 'app/model/NewCustomer';
import { CustomerService } from '../customer.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  dataToForm: NewCustomerRequest;
  public loading: boolean;

  constructor(
    private dialogRef: MatDialogRef<SignupComponent>,
    private principalService: CustomerService,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent,
    public confirmDialog: MatDialog) {

    this.dialogRef.disableClose = true;

    this.dataToForm = new NewCustomerRequest();
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  createNewCustomer(): void {
    this.loading = true;
    this.principalService.signup(this.dataToForm)
      .then(() => {
        this.notification.showSucess("Solicitação realizada com sucesso, verifique o seu e-mail!");
        this.dialogRef.close();
      })
      .catch(error => this.errorHandler.handle(error, null))
      .then(() => this.loading = false);
  }
}
