import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { AnamnesisFormFilter } from 'app/model/AnamnesisForm';
import { Page, Pageable } from 'app/model/Util';
import { AnamnesisService } from 'app/visit/anamnesis/anamnesis.service';

@Component({
  selector: 'app-anamnesis-forms',
  templateUrl: './anamnesis-forms.component.html',
  styleUrls: ['./anamnesis-forms.component.css']
})
export class AnamnesisFormsComponent implements OnInit {


  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: AnamnesisFormFilter;

  constructor(private principalService: AnamnesisService,
    private errorHandler: ErrorHandlerService) { }

  ngOnInit(): void {
    this.loading = true;
    this.page = new Page();
    this.filters = new AnamnesisFormFilter();
    this.pageSettings = new Pageable();
    this.principalService.getPageOfForms(this.filters, this.pageSettings).then(response => {
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

  applyFilter() {
    if (this.filters) {
      this.loading = true;
      this.pageSettings = new Pageable();
      this.principalService.getPageOfForms(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        this.datas = response.content;
        this.page = response;
        this.dataNotFound = this.datas.length === 0;
      }).catch(error => {
        this.dataNotFound = this.datas ? this.datas.length === 0 : true;
        this.loading = false;
        this.errorHandler.handle(error, null);
      });
    }
  }

}
