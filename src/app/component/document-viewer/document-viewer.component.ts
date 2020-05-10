import { Component, OnInit, Inject } from '@angular/core';
import { DigitalDocument } from 'app/model/DigitalDocument';
import { UtilService } from 'app/core/util.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {

  public document: DigitalDocument;
  public loading: boolean;

  constructor(private utilService: UtilService, public dialogDocumentViewer: MatDialogRef<DocumentViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DigitalDocument, public errorHandler: ErrorHandlerService, private sanitizer: DomSanitizer,
    private router: Router) {
    this.dialogDocumentViewer.disableClose = true;
    this.document = new DigitalDocument();
  }

  ngOnInit(): void {
    this.loading = true;
    var selectedDigitalDocumentId = this.dialogDocumentViewer.componentInstance.data['selectedDigitalDocumentId'];
    this.utilService.getDigitalDocumentById(selectedDigitalDocumentId).then(resp => {
      this.document = resp;
      setTimeout(() => {
        this.loading = false;
      }, 2000); 
    }).catch(error => {
      this.loading = false;
      this.document = new DigitalDocument();
      this.errorHandler.handle(error, this.dialogDocumentViewer);
    });

  }

  onCancelClick(): void {
    this.dialogDocumentViewer.close();
  }

  cleanUrl(base64) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + base64);
  }

}
