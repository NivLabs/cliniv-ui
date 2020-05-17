import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SeetingsInfo } from 'app/model/Settings';
import { SettingsService } from 'app/settings/settings.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  public loading: boolean;
  public settings: SeetingsInfo;
  public dataSource: any;
  public displayedColumns: any;

  constructor(private principalService: SettingsService, private errorHandler: ErrorHandlerService) { }

  ngOnInit(){
    this.settings = new SeetingsInfo();
    this.loading = true;

    this.principalService.getSettings().then(resp => {
      this.loading = false;
      this.settings = resp;
      this.dataSource = new MatTableDataSource(this.settings.parameters); 
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, null);
    });

    this.displayedColumns = ['Grupo', 'Nome', 'Valor'];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
