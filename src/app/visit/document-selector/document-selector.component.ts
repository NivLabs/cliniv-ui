import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DigitalDocument } from 'app/model/DigitalDocument';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-document-selector',
  templateUrl: './document-selector.component.html',
  styleUrls: ['./document-selector.component.scss']
})
export class DocumentSelectorComponent implements OnInit {
 
  displayedColumns = ['id', 'createdAt', 'name', 'actions'];
  dataSource: MatTableDataSource<DigitalDocument>;

  constructor(public dialog: MatDialog, public documentSelectorComponent: MatDialogRef<DocumentSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DigitalDocument) { }

  ngOnInit(): void {
    this.dataSource = this.documentSelectorComponent.componentInstance.data['dataSource'];
  }
}
