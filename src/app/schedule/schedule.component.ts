import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { Pageable } from 'app/model/Util';
import { ProfessionalService } from 'app/professional/professional.service';
import { ScheduleFilter, ScheduleInfo, ScheduleParameters } from '../model/Schedule';
import { ScheduleEditComponent } from './schedule-edit/schedule-edit.component';
import { ScheduleService } from './schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  public filters: ScheduleFilter = new ScheduleFilter();
  responsibleControl = new FormControl();
  confirmationSelectControl = new FormControl();
  statusSelectControl = new FormControl();
  availableScheduleTimes: ScheduleInterval[] = [];
  public schedules: ScheduleInfo[] = [];
  public responsibles: any;
  public loading = false;
  public selectedDate: any;
  public schedulerParams: ScheduleParameters = new ScheduleParameters();

  constructor(private dialog: MatDialog, private errorHandler: ErrorHandlerService, private principalService: ScheduleService, private professionalService: ProfessionalService, private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.filters.selectedDate = this.formatDate(this.selectedDate);
    this.loadResponsibles()
      .then(() => this.loadScheduleByFilters());

  }

  selectMonth(event) {
    console.log(event);
  }

  /**
   * Monta a agenda com a estrutura carregada da API
   */
  mountSchedule() {
    this.availableScheduleTimes = [];

    var initHour = this.schedulerParams.initialAttendanceTime.split(":")[0];
    var initMinute = this.schedulerParams.initialAttendanceTime.split(":")[1];

    var scheduleTime = new Date(this.selectedDate);
    scheduleTime.setHours(Number.parseInt(initHour));
    scheduleTime.setMinutes(Number.parseInt(initMinute));
    if (this.schedules && this.schedules.length > 0 && new Date(this.schedules[0].schedulingDateAndTime) < scheduleTime) {
      scheduleTime = new Date(this.schedules[0].schedulingDateAndTime);
    }


    var endHour = this.schedulerParams.endAttendanceTime.split(":")[0];
    var endMinute = this.schedulerParams.endAttendanceTime.split(":")[1];
    var endScheduleTime = new Date(this.selectedDate);
    endScheduleTime.setHours(Number.parseInt(endHour));
    endScheduleTime.setMinutes(Number.parseInt(endMinute));
    if (this.schedules && this.schedules.length > 0 && new Date(this.schedules[this.schedules.length - 1].schedulingDateAndTime) > endScheduleTime) {
      endScheduleTime = new Date(this.schedules[this.schedules.length - 1].schedulingDateAndTime);
    }

    while (scheduleTime < endScheduleTime) {
      var interval = new ScheduleInterval();
      interval.id = new Date(scheduleTime);
      interval.timeInterval = this.schedulerParams.timeIntervalInMinutes;

      var timeWithInterval = new Date(scheduleTime);
      timeWithInterval.setMinutes(scheduleTime.getMinutes() + this.schedulerParams.timeIntervalInMinutes);
      this.schedules.forEach(schedule => {
        if (new Date(schedule.schedulingDateAndTime) > interval.id && new Date(schedule.schedulingDateAndTime) < timeWithInterval)
          interval.times.push(schedule);
      });

      this.availableScheduleTimes.push(interval);
      scheduleTime = new Date(scheduleTime.setMinutes(scheduleTime.getMinutes() + this.schedulerParams.timeIntervalInMinutes));
    }
  }

  /**
   * 
   * @param status 
   */
  getStatusDesc(status) {
    switch (status) {
      case 'CONFIRMED':
        return 'Paciente confirmado';
      case 'COMPLETED':
        return 'O paciente compareceu';
      case 'CANCELED':
        return 'O paciente cancelou';
      case 'MISSED':
        return 'O paciente faltou';
      case 'WAITING_CONFIRMATION':
        return 'Aguardando confirmação do paciente';
      case 'RESCHEDULED':
        return 'O paciente reagendou';
      default:
        return 'Sem infomações...';
    }
  }

  /**
   * Carrega as informações necessárias para a Agenda
   */
  loadScheduleByFilters() {
    this.loading = true;
    return this.principalService.getByFilter(this.filters).then(resp => {
      this.schedules = resp;
      this.schedules.sort((a, b) => new Date(a.schedulingDateAndTime).getTime() - new Date(b.schedulingDateAndTime).getTime());
      this.mountSchedule();
      this.loading = false;
    }).catch(error => {
      this.schedules = [];
      this.mountSchedule();
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  /**
   * Carrega os profissionais para o atendimento
   */
  loadResponsibles() {
    this.loading = true;
    var pageSettings = new Pageable();
    pageSettings.size = 50;
    return this.professionalService.getPage(null, pageSettings).then(response => {
      if (!response.content || !response.content.length) {
        this.notification.showWarning("Nenhum profissional encontrado, favor realizar o cadastro antes de agendar");
      }
      this.responsibles = response.content;
    }).catch(e => {
      this.responsibles = [];
    });
  }

  /**
   * 
   * @param event Evento de seleção de data no datapicker
   */
  onSelect(event) {
    this.filters.selectedDate = this.formatDate((event));
    this.selectedDate = event;
    this.loadScheduleByFilters();
  }

  selectResponsible(id) {
    this.filters.professionalId = id ? id : null;
    this.loadScheduleByFilters();
  }

  selectStatus(status) {
    this.filters.status = status ? status : null;
    this.loadScheduleByFilters();
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  openDialogWithSchedule(id) {
    this.loading = true;
    this.principalService.findById(id).then(schedule => {
      this.loading = false;
      const dialogRef = this.dialog.open(ScheduleEditComponent, {
        width: '100%',
        height: 'auto',
        data: { schedule, responsibles: this.responsibles }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loadScheduleByFilters();
      });
    }).catch(error => {
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }


  /**
   * 
   * @param schedule Item de agendamento
   */
  openDialog(selectedDate: Date, selectedTime: Date): void {
    if (selectedDate && selectedDate) {
      var selectedDate = new Date();
      selectedDate.setDate(selectedDate.getDate());
      selectedDate.setTime(selectedTime.getTime());
      // GMT -3
      selectedTime.setHours(selectedTime.getHours() - 3);
      var schedule = new ScheduleInfo();
      schedule.schedulingDateAndTime = selectedTime.toISOString().slice(0, 16);
    }
    const dialogRef = this.dialog.open(ScheduleEditComponent, {
      width: '100%',
      height: 'auto',
      data: { schedule, responsibles: this.responsibles }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadScheduleByFilters();
    });
  }

}

/**
 * Objeto padrão da Agenda
 */
export class ScheduleInterval {
  id: Date;
  timeInterval: number;
  times: ScheduleInfo[] = [];
}