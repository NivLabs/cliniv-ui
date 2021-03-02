import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserInfo } from 'app/model/User';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  dataToForm: UserInfo;
  constructor(private dialogRef: MatDialogRef<SignupComponent>) {
    this.dialogRef.disableClose = true;

    this.dataToForm = new UserInfo();
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


}
