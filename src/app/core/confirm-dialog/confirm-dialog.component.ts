import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


class DialogInfo {
    title: string;
    message: string;
    button: {
        yes: string;
        no: string;
    }
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
        if (this.data.button === undefined) {
            this.data.button = {
                yes: "Confirmar",
                no: "Cancelar"
            }
        } else {
            if (this.data.button.yes === undefined || this.data.button.yes === "") {
                this.data.button.yes = "Confirmar";
            }
            if (this.data.button.no === undefined || this.data.button.no === "") {
                this.data.button.no = "Cancelar";
            }
        }
    }

    onNoClick() {
        this.dialogRef.close();
    }
}
