import { Component, OnInit } from '@angular/core';
import { ConvenantFilter } from 'app/model/Convenant';
import { Page, Pageable } from 'app/model/Util';
import { ConvenantService } from './convenant.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';

@Component({
  selector: 'app-convenant',
  templateUrl: './convenant.component.html',
  styleUrls: ['./convenant.component.css']
})
export class ConvenantComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  public datas: [];
  public page: Page;
  public pageSettings: Pageable;
  public filters: ConvenantFilter;

  constructor(private principalService: ConvenantService, private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.loading = true;
    this.page = new Page();
    this.filters = new ConvenantFilter();
    this.pageSettings = new Pageable();
    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.datas = response.content;
      this.page = response;
      this.dataNotFound = this.datas.length === 0;
      console.log(this.dataNotFound);
    }).catch(error => {
      this.dataNotFound = this.datas ? this.datas.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }


  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }

  /**
   * Realiza a paginação dos componentes
   */
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
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, null);
      })
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
        console.log(this.dataNotFound);
      }).catch(error => {
        this.dataNotFound = this.datas ? this.datas.length === 0 : true;
        this.loading = false;
        this.errorHandler.handle(error, null);
      });
    }
  }
}
