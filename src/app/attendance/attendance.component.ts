import { Component, OnInit } from '@angular/core';
import { Page, Pageable } from 'app/model/Util';
import { AttendanceFilters } from '../model/Attendance';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorService } from 'app/sector/sector.service';
import { AttendanceService } from 'app/attendance/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: [];
  page: Page;
  pageSettings: Pageable;
  filters: AttendanceFilters;
  public sectorNotFound: boolean;
  sectors = [];

  constructor(private principalService: AttendanceService, private errorHandler: ErrorHandlerService, private sectorService: SectorService) { }

  ngOnInit() {
    this.loading = true;
    this.page = new Page();
    this.filters = new AttendanceFilters();
    this.pageSettings = new Pageable();

    this.sectorService.getListOfSectors(null).then(response => {
      this.sectors = response;
      this.sectorNotFound = this.sectors.length === 0;
    }).catch(error => {
      this.sectorNotFound = this.sectorNotFound !== undefined ? this.sectors.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });

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

  selectPatientType(newValue) {
    this.filters.typePatient = newValue;
    this.applyFilter();
  }

  selectAttendanceType(newValue) {
    this.filters.typeAttendance = newValue;
    this.applyFilter();
  }

  selectSector(newValue) {
    this.filters.sector = newValue;
    this.applyFilter();
  }

  applyFilter() {
    if (this.filters) {
      this.loading = true;
      this.pageSettings = new Pageable();
      this.principalService.getPage(this.filters, this.pageSettings).then(response => {
        this.loading = false;
        this.datas = response.content;
        this.dataNotFound = this.datas.length === 0;
      }).catch(error => {
        this.dataNotFound = this.datas ? this.datas.length === 0 : true;
        this.loading = false;
        this.errorHandler.handle(error, null);
      });
    }
  }

  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
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
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, null);
      })
    }
  }

}
