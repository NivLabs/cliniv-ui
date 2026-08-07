import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UserService } from './user.service';
import { Page, Pageable } from 'app/model/Util';
import { UserFilters } from 'app/model/User';
import { UserEditComponent } from './user-edit/user-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { DataTableColumn } from '../components/data-table/data-table.component';
import { formatCpf, formatPhone } from '../model/format.util';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>
  page: Page;
  pageSettings: Pageable;
  filters: UserFilters;

  columns: Array<DataTableColumn> = [
    { key: 'fullName', label: 'Nome', sortable: true, sortKey: 'person.fullName' },
    { key: 'id', label: 'Matrícula', sortable: true },
    { key: 'userName', label: 'Usuário', sortable: true },
    { key: 'cpf', label: 'CPF', cell: row => row.cpf ? formatCpf(row.cpf) : '-', sortable: true, sortKey: 'person.cpf' },
    {
      key: 'principalNumber', label: 'Telefone', cell: row => formatPhone(row.principalNumber),
      sortable: true, sortKey: 'person.principalNumber'
    }
  ];

  constructor(public dialog: MatDialog, private principalService: UserService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.page = new Page();
    this.filters = new UserFilters();
    this.pageSettings = new Pageable();
    this.fetch();
  }

  onPageChange(event: PageEvent) {
    this.pageSettings.page = event.pageIndex;
    this.pageSettings.size = event.pageSize;
    this.fetch();
  }

  onSortChange(sort: Sort) {
    this.pageSettings.page = 0;
    if (sort.direction) {
      this.pageSettings.orderBy = sort.active;
      this.pageSettings.direction = sort.direction.toUpperCase() as 'ASC' | 'DESC';
    } else {
      delete this.pageSettings.orderBy;
      delete this.pageSettings.direction;
    }
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
      this.errorHandler.handle(error, null);
    });
  }

  applyFilter() {
    if (this.filters) {
      this.pageSettings.page = 0;
      this.fetch();
    }
  }

  /**
  * 
  * Executa um evento à partir da tecla enter
  * 
  * @param event Evento de tecla
  */
  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }

  /**
   * 
   * @param id Identificador do usuário
   */
  openDialog(id) {
    const dialogRef = this.dialog.open(UserEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.applyFilter();
    });
  }
}
