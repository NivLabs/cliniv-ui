import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { pairs } from 'rxjs';
import { Visit, VisitService } from '../visit.service';
import { visitAll } from '@angular/compiler';

@Component({
    selector: 'app-new-visit',
    templateUrl: './new-visit.component.html'
})
export class NewVisitComponent implements OnInit {

    newVisit: Visit;

    constructor(public dialogRef: MatDialogRef<NewVisitComponent>, public visitService: VisitService,
        @Inject(MAT_DIALOG_DATA) public data: number) { }

    ngOnInit(): void {
        if (this.dialogRef.componentInstance.data !== null) {
            this.newVisit = new Visit();
            this.newVisit.id = this.dialogRef.componentInstance.data['patientId'];
            this.newVisit.entryCause = '';
            this.newVisit.responsibleId = undefined;
            this.newVisit.isFinished = false;
        }
    }
}  