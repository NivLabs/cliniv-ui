import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { PatientHistory } from 'app/model/Attendance';
@Component({
    selector: 'app-patient-history',
    templateUrl: './patient-history.component.html'
})
export class PatientHistoryComponent implements OnInit {

    displayedColumns = ['id', 'entryDatetime', 'entryCause', 'isFinished', 'actions'];
    dataSource: MatTableDataSource<PatientHistory>;

    constructor(public dialogRef: MatDialogRef<PatientHistoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Array<PatientHistory>) { }

    ngOnInit(): void {
        if (this.dialogRef.componentInstance.data['patientHistory'] !== null) {
            this.dataSource = this.dialogRef.componentInstance.data['patientHistory'];
        }
    }

    showStatus(status: boolean) {
        return status ? 'Teve alta' : 'Em atendimento';
    }
}  