import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DigitalDocument } from 'app/model/DigitalDocument';
import { UtilService } from 'app/core/util.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PDFProgressData, PdfViewerComponent, PDFDocumentProxy } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css', './document-viewer.component.scss']
})

export class DocumentViewerComponent implements OnInit {

  public document: DigitalDocument;
  public loading: boolean;
  public error: any;
  public rotation = 0;
  public zoom = 1.0;
  public pdf: any;
  public progressData: PDFProgressData;
  public isLoaded = false;
  public outline: any[];
  public pdfQuery = '';
  public isOutlineShown = false;
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;

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
      this.document.base64 = 'data:application/pdf;base64,' + this.document.base64;
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

  incrementZoom(amount: number) {
    this.zoom += amount;
  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  /**
   * Get pdf information after it's loaded
   * @param pdf
   */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isLoaded = true;

    this.loadOutline();
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  /**
   * Pdf loading progress callback
   * @param {PDFProgressData} progressData
   */
  onProgress(progressData: PDFProgressData) {
    console.log(progressData);
    this.progressData = progressData;
    this.isLoaded = false;
    this.error = null; // clear error
  }

  getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Navigate to destination
   * @param destination
   */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.navigateTo(destination);
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param {CustomEvent} e
   */
  pageRendered(e: CustomEvent) {
    console.log('(page-rendered)', e);
  }

  searchQueryChanged(newQuery: string) {
    if (newQuery !== this.pdfQuery) {
      this.pdfQuery = newQuery;
      this.pdfComponent.pdfFindController.executeCommand('find', {
        query: this.pdfQuery,
        highlightAll: true,
      });
    } else {
      this.pdfComponent.pdfFindController.executeCommand('findagain', {
        query: this.pdfQuery,
        highlightAll: true,
      });
    }
  }

  download() {
    this.pdf.getData().then((u8) => {
      let blob = new Blob([u8.buffer], {
        type: 'application/pdf'
      });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // IE11 and Edge
        window.navigator.msSaveOrOpenBlob(blob, this.document.name);
      } else {
        // Chrome, Safari, Firefox, Opera
        let url = URL.createObjectURL(blob);
        this.openLink(url);
        // Remove the link when done
        setTimeout(function () {
          window.URL.revokeObjectURL(url);
        }, 5000);
      }
    });
  }

  private openLink(url: string) {
    let a = document.createElement('a');
    // Firefox requires the link to be in the body
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = this.document.name;
    a.click();
    // Remove the link when done
    document.body.removeChild(a);
  }

}
