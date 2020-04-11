import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { ProfessionalService } from './professional.service';
import { ProfessionalEditComponent } from './professional-edit/professional-edit.component';
import { Page, Pageable } from 'app/model/Util';
import { ProfessionalFilters } from 'app/model/Professional';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.css']
})
export class ProfessionalComponent implements OnInit {


  public loading: boolean;
  public responsibleNotFound: boolean;
  responsibles: any;
  page: Page;
  pageSettings: Pageable;
  filters: ProfessionalFilters;

  constructor(public dialog: MatDialog, private utilService: UtilService, private professionalService: ProfessionalService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit() {
    this.loading = true;
    this.professionalService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.responsibles = response.content;
      this.responsibleNotFound = this.responsibles.length === 0;
    }).catch(error => {
      this.responsibleNotFound = this.responsibles !== undefined ? this.responsibles.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  /**
   * Realiza a paginação dos componentes
   */
  loadNextPage() {
    if (this.page && !this.page.last) {
      this.loading = true;
      this.pageSettings.page = this.pageSettings.page + 1;
      this.professionalService.getPage(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        response.content.forEach(newItem => {
          this.responsibles.push(newItem);
        })
        this.page = response;
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, null);
      })
    }
  }

  openDialog(id): void {
    const dialogRef = this.dialog.open(ProfessionalEditComponent, {
      width: '100%',
      height: '80%',
      data: { selectedProfessional: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}