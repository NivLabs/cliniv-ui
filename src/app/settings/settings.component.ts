import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SeetingsInfo } from 'app/model/Settings';
import { SettingsService } from 'app/settings/settings.service';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { AddressService } from 'app/core/address.service';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public loading: boolean;
  public settings: SeetingsInfo;
  public dataSource: any;
  public displayedColumns: any;

  constructor(private principalService: SettingsService, private errorHandler: ErrorHandlerService, private addressService: AddressService,
    private notification: NotificationsComponent, public confirmDialog: MatDialog) { }

  ngOnInit() {
    this.settings = new SeetingsInfo();
    this.loading = true;

    this.principalService.getSettings().then(resp => {
      this.loading = false;
      this.settings = resp;
      this.dataSource = new MatTableDataSource(this.settings.parameters);
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, null);
    });

    this.displayedColumns = ['id', 'group', 'name', 'value'];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  enterKeyPress(event: any, parameterId: number, value: any) {
    if (event.key === "Enter") {
      this.updateParameter(parameterId, value);
    }
  }

  changeToggleParameter(event: any, parameterId: number) {
    this.updateParameter(parameterId, event.checked);
  }

  changeSelectParameter(parameterId: number, value: any) {
    this.updateParameter(parameterId, value);
  }

  searchAddressByCEP() {
    this.loading = true;
    this.addressService.getAddressByCep(this.settings.customerInfo.address.postalCode).then(address => {
      this.loading = false;
      this.settings.customerInfo.address = address;
    }).catch(error => {
      this.loading = false;
      this.notification.showWarning("Não foi possível realizar a busca do CEP, verifique se o mesmo está correto.")
    });
  }

  updateParameter(parameterId: number, value: any) {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Tem certeza que deseja alterar o valor desse parâmetro?' }
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.principalService.update(parameterId, value).then(() => {
          this.notification.showSucess("Parâmetro alterado com sucesso!");
        }).catch(error => {
          this.loading = false;
          this.errorHandler.handle(error, confirmDialogRef);
        });
      }
      this.loading = false;
    });
  }

}
