import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Person, PersonDocument } from 'app/model/Person';
import { NotificationsComponent } from '../notification/notifications.component';
import { UtilService } from '../util.service';

@Component({
  selector: 'app-person-document-dialog',
  templateUrl: './person-document-dialog.component.html',
  styleUrls: ['./person-document-dialog.component.css']
})
export class PersonDocumentDialogComponent implements OnInit {

  public loading = false;
  public dataToForm: PersonDocument;

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<PersonDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonDocument,
    public formBuilder: UntypedFormBuilder,
    private utilService: UtilService,
    private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    var document = this.dialogRef.componentInstance.data['document'];
    if (document && document.personId) {
      this.dataToForm = document;
    } else {
      this.onCancelClick();
    }

  }

  /**
   * Seleciona tipo do documento
   */
  selectDocumentType(newValue) {
    this.dataToForm = new PersonDocument();
    this.dataToForm.type = newValue;
  }

  /**
   * Fecha o formulário sem salvar alterações
   */
  onCancelClick(): void {
    this.dialogRef.close();
  }
}
