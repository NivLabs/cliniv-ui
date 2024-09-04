import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { DocumentTemplateFilter } from 'app/model/DocumentTemplate';
import { Page, Pageable } from 'app/model/Util';
import { DocumentTemplateEditComponent } from './document-template-edit/document-template-edit.component';
import { DocumentTemplateService } from './document-template.service';

@Component({
  selector: 'app-document-template',
  templateUrl: './document-template.component.html',
  styleUrls: ['./document-template.component.css']
})
export class DocumentTemplateComponent implements OnInit {


  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: DocumentTemplateFilter;
  card: boolean;

  constructor(
    private principalService: DocumentTemplateService,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog, 
    private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.loading = true;
    this.page = new Page();
    this.filters = new DocumentTemplateFilter();
    this.pageSettings = new Pageable();
    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.datas = response.content;
      this.page = response;
      this.dataNotFound = this.datas.length === 0;
    }).catch(error => {
      this.dataNotFound = this.datas ? this.datas.length === 0 : true;
      this.loading = false;
      this.handlerException(error);
    });
  }


  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }

  applyFilter() {
    if (this.filters) {
      this.loading = true;
      this.pageSettings = new Pageable();
      this.principalService.getPage(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        this.datas = response.content;
        this.page = response;
        this.dataNotFound = this.datas.length === 0;
      }).catch(error => {
        this.dataNotFound = this.datas ? this.datas.length === 0 : true;
        this.loading = false;
        this.handlerException(error);
      });
    }
  }

  loadNextPage() {
    if (this.page && !this.page.last) {
      this.loading = true;
      this.pageSettings.page = this.pageSettings.page + 1;
      this.principalService.getPage(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        response.content.forEach(newItem => {
          this.datas.push(newItem);
        })
        this.page = response;
      }).catch((error) => this.handlerException(error));
    }
  }

  handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialog);
  }


  openDialog(id): void {
    const dialogRef = this.dialog.open(DocumentTemplateEditComponent, {
      width: '100%',
      height: 'auto',
      data: {selectedDocumentTemplateId: id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}
