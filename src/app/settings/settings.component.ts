import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SeetingsInfo } from 'app/model/Settings';
import { SettingsService } from 'app/settings/settings.service';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { AddressService } from 'app/core/address.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {


  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public loading: boolean;
  public settings: SeetingsInfo;
  public dataSource: any;
  public displayedColumns: any;

  constructor(private principalService: SettingsService, private errorHandler: ErrorHandlerService, private addressService: AddressService, private notification: NotificationsComponent) { }

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

}
