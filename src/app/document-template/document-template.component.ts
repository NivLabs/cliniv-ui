import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { DocumentTemplateFilter } from 'app/model/DocumentTemplate';
import { Page, Pageable } from 'app/model/Util';
import { PageEvent } from '@angular/material/paginator';
import { DocumentTemplateEditComponent } from './document-template-edit/document-template-edit.component';
import { DocumentTemplateService } from './document-template.service';
import { DataTableColumn } from '../components/data-table/data-table.component';

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

  columns: Array<DataTableColumn> = [
    { key: 'id', label: 'Identificador' },
    { key: 'description', label: 'Descrição' }
  ];

  constructor(
    private principalService: DocumentTemplateService,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog,
    private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.page = new Page();
    this.filters = new DocumentTemplateFilter();
    this.pageSettings = new Pageable();
    this.fetch();
  }


  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }

  applyFilter() {
    if (this.filters) {
      this.pageSettings.page = 0;
      this.fetch();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSettings.page = event.pageIndex;
    this.pageSettings.size = event.pageSize;
    this.fetch();
  }

  private fetch() {
    this.loading = true;
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
