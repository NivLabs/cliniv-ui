import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { pairs } from 'rxjs';
import { Visit } from '../visit.service';
import { stat } from 'fs';
@Component({
    selector: 'app-patient-history',
    templateUrl: './patient-history.component.html'
})
export class PatientHistoryComponent implements OnInit {

    displayedColumns = ['id', 'entryDatetime', 'entryCause', 'isFinished', 'actions'];
    dataSource: MatTableDataSource<Visit>;

    @ViewChild(MatPaginator, null) paginator: MatPaginator;
    @ViewChild(MatSort, null) sort: MatSort;


    constructor(public dialogRef: MatDialogRef<PatientHistoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Array<Visit>) { }

    ngOnInit(): void {
        if (this.dialogRef.componentInstance.data['patientHistory'] !== null) {
            this.dataSource = this.dialogRef.componentInstance.data['patientHistory'];
        }
    }
    
    showStatus(status: boolean) {
        return status ? 'Teve alta' : 'Em atendimento';
    }
}  