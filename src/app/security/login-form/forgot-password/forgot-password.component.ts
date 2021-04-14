import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserInfo } from 'app/model/User';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) { }

  dataToForm: UserInfo;

  ngOnInit(): void {
    this.dataToForm = new UserInfo();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
  
  forgotPassword(): void {

  }

}
