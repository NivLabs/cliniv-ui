import { Component, Inject, OnInit, Optional } from "@angular/core";
import { UpdatePassword } from "app/model/UpdatePassword";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserProfileService } from "../user-profile.service";
import { ErrorHandlerService } from "app/core/error-handler.service";
import { NotificationsComponent } from "app/core/notification/notifications.component";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit {
  dataToForm: UpdatePassword;
  public loading: boolean = false;
  public mandatory: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private service: UserProfileService,
    public errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data && this.data.mandatory) {
      this.mandatory = true;
      this.dialogRef.disableClose = true;
    }
  }

  ngOnInit(): void {
    this.dataToForm = new UpdatePassword();
    if (this.data && this.data.oldPassword) {
      this.dataToForm.oldPassword = this.data.oldPassword;
    }
  }

  onChangePassword() {
    this.loading = true;
    this.service
      .changePassword(this.dataToForm)
      .then(this.onSuccess.bind(this))
      .catch(this.onError.bind(this))
      .then(() => (this.loading = false));
  }

  onSuccess() {
    this.notification.showSucess("Senha alterada com sucesso!");
    this.dialogRef.close(true);
  }

  onError(error) {
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
