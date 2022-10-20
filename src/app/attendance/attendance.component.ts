import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Page, Pageable } from 'app/model/Util';
import { AttendanceFilters } from '../model/Attendance';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorService } from 'app/sector/sector.service';
import { AttendanceService } from 'app/attendance/attendance.service';
import { Router } from '@angular/router';
import { SectorFilters } from 'app/model/Sector';
import { debounceTime, map, distinctUntilChanged, filter } from "rxjs/operators";
import { fromEvent } from 'rxjs';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  public displayedColumns: any;
  public dataSource: any;

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

  constructor(private principalService: AttendanceService, private errorHandler: ErrorHandlerService, private sectorService: SectorService, private router: Router) {

    this.displayedColumns = ['id', 'patientId', 'fullName', 'entryDatetime', 'exitDatetime', 'cnsNumber', 'actions'];
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.loading = true;
    this.page = new Page();
    this.filters = new AttendanceFilters();
    this.pageSettings = new Pageable();

    this.sectorPage = new Page();
    this.sectorsFilters = new SectorFilters();
    this.sectorspageSettings = new Pageable();
    this.sectorspageSettings.size = 6;

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
    this.applyFilter(null);
  }

  selectPatientType(newValue) {
    this.filters.patientType = newValue;
    this.applyFilter(null);
  }

  selectAttendanceType(newValue) {
    this.filters.entryType = newValue;
    this.applyFilter(null);
  }

  selectSector(newValue) {
    this.filters.sectorId = newValue;
    this.sectors = [];
    this.applyFilter(null);
  }

  applyFilter(event) {
    this.loading = true;
    if (event) {
      if (event.previousPageIndex > event.pageIndex) {
        this.pageSettings.page -= 1;
      } else {
        this.pageSettings.page += 1;
      }
    }

    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.page = response;
    }).catch(error => {
      this.errorHandler.handle(error, null);
    }).finally(() => {
      if (!this.page.content) {
        this.dataSource = new MatTableDataSource([]);
      } else {
        this.dataSource = new MatTableDataSource(this.page.content)
      }
      this.loading = false;
    });
  }

  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter(null);
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

  getTime(entryDateTime) {

    var initDate = moment(entryDateTime, "YYYY-MM-DD'T'HH:mm:ss")
    var currentDate = moment();
    var ms = currentDate.diff(initDate);
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm");
    var hh = parseInt(s.split(":")[0]);
    var mm = new Number(s.split(":")[1]);
    return (hh ? hh + "h(s) e " : "") + mm + "min(s)";
  }
}
