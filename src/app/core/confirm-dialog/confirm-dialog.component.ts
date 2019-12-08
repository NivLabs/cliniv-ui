import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


class DialogInfo {
    title: string;
    message: string;
    isConfirmed: boolean;
}

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogInfo) {
        this.dialogRef.disableClose = true;
    }

    ngOnInit() {
        this.data.isConfirmed = true;
    }

    onNoClick() {
        this.dialogRef.close();
    }
}
