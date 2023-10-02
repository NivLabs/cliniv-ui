import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AttendanceService } from 'app/attendance/attendance.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorFilters } from 'app/model/Sector';
import { Page, Pageable } from 'app/model/Util';
import { SectorService } from 'app/sector/sector.service';
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { AttendanceFilters } from '../model/Attendance';
import { ReportGeneratorComponent } from './report-generator/report-generator.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: AttendanceFilters;
  public sectorNotFound: boolean;
  sectors = [];
  sectorPage: Page;
  sectorsFilters: SectorFilters;
  sectorspageSettings: Pageable;
  public loadingAutocomplete: boolean;

  private readonly RELOAD_TOP_SCROLL_POSITION = 30;
  @ViewChild('sector', { static: true }) searchInput: ElementRef;

  constructor(
    private principalService: AttendanceService,
    private errorHandler: ErrorHandlerService,
    private sectorService: SectorService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loading = true;
    this.page = new Page();
    this.filters = new AttendanceFilters();
    this.pageSettings = new Pageable();

    this.sectorPage = new Page();
    this.sectorsFilters = new SectorFilters();
    this.sectorspageSettings = new Pageable();
    this.sectorspageSettings.size = 100;

    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 0)
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.sectorsFilters.description = text;

      if (this.sectorsFilters.description) {
        this.loadingAutocomplete = true;
        this.sectorspageSettings.page = 0;
        this.sectorService.getPage(this.sectorsFilters, this.sectorspageSettings).then(response => {
          this.loadingAutocomplete = false;
          this.sectors = response.content;
          this.sectorPage = response;
          this.sectorNotFound = this.sectors.length === 0;
        }).catch(error => {
          this.sectorNotFound = this.sectorNotFound !== undefined ? this.sectors.length === 0 : true;
          this.loadingAutocomplete = false;
          this.errorHandler.handle(error, null);
        });
      }
      else {
        this.filters.sectorId = "";
        this.sectors = [];
      }

    });
    this.applyFilter();
  }

  selectPatientType(newValue: string) {
    this.filters.patientType = newValue;
    this.applyFilter();
  }

  selectAttendanceType(newValue: string) {
    this.filters.entryType = newValue;
    this.applyFilter();
  }

  selectActiveType(newValue: string) {
    this.filters.activeType = newValue;
    this.applyFilter();
  }

  selectSector(newValue) {
    this.filters.sectorId = newValue;
    this.sectors = [];
    this.applyFilter();
  }

  applyFilter() {
    this.loading = true;
    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.page = response;
      this.datas = response.content;
    }).catch(error => {
      this.errorHandler.handle(error, null);
    }).finally(() => {
      this.dataNotFound = !this.page.content
      this.loading = false;
    });
  }

  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }

  goToVisit(patientId) {
    this.router.navigate(['visit', { patientId: patientId }]);
  }

  loadAutoCompleteNextPage() {
    if (this.sectorPage && !this.sectorPage.last) {
      this.loadingAutocomplete = true;
      this.sectorspageSettings.page = this.sectorspageSettings.page + 1;
      this.sectorService.getPage(this.sectorsFilters, this.sectorspageSettings).then(response => {
        this.loadingAutocomplete = false;
        response.content.forEach(newItem => {
          this.sectors.push(newItem);
        })
        this.sectorPage = response;
      }).catch(error => {
        this.loadingAutocomplete = false;
        this.errorHandler.handle(error, null);
      })
    }
  }

  registerPanelScrollEvent() {
    const panel = document.querySelector('[id^="mat-autocomplete"]');
    panel.addEventListener('scroll', event => this.loadAllOnScroll(event));
  }

  loadAllOnScroll(event) {
    if (event.target.scrollTop > this.RELOAD_TOP_SCROLL_POSITION) {
      this.loadAutoCompleteNextPage();
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

  getTime(entryDateTime, exitDateTime) {

    const initDate = moment(entryDateTime, "YYYY-MM-DD'T'HH:mm:ss")
    const currentDate = exitDateTime ? moment(exitDateTime, "YYYY-MM-DD'T'HH:mm:ss") : moment();
    const ms = currentDate.diff(initDate);
    const d = moment.duration(ms);
    const s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
    const hh = parseInt(s.split(":")[0]);
    const mm = new Number(s.split(":")[1]);
    return (hh ? hh + "h(s) e " : "") + mm + "min(s)";
  }

  openReportGenerator() {
    this.dialog.open(ReportGeneratorComponent, {
      width: '50%'
    });
  }

}
