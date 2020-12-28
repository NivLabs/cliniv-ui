import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { PatientInfo } from 'app/model/Patient';
import { Professional } from 'app/model/Professional';
import { Pageable } from 'app/model/Util';
import { ProfessionalService } from 'app/professional/professional.service';
import { ScheduleFilter, ScheduleInfo, ScheduleParameters } from '../model/Schedule';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  public filters: ScheduleFilter = new ScheduleFilter();
  responsibleControl = new FormControl();
  confirmationSelectControl = new FormControl();
  attendedSelectControl = new FormControl();
  availableScheduleTimes: ScheduleInterval[] = [];
  public schedules: ScheduleInfo[] = [];
  public responsibles: any;
  public loading = false;
  public selectedDate: any;
  public schedulerParams: ScheduleParameters = new ScheduleParameters();

  constructor(private professionalService: ProfessionalService, private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.loadResponsibles();
    this.loadScheduleByDate();
    this.mountSchedule();
  }

  mountSchedule() {

    var initHour = this.schedulerParams.initialAttendanceTime.split(":")[0];
    var initMinute = this.schedulerParams.initialAttendanceTime.split(":")[1];

    var scheduleTime = new Date();
    scheduleTime.setHours(Number.parseInt(initHour));
    scheduleTime.setMinutes(Number.parseInt(initMinute));
    if (this.schedules && this.schedules[0].schedulingDateAndTime < scheduleTime) {
      scheduleTime = this.schedules[0].schedulingDateAndTime;
    }


    var endHour = this.schedulerParams.endAttendanceTime.split(":")[0];
    var endMinute = this.schedulerParams.endAttendanceTime.split(":")[1];
    var endScheduleTime = new Date();
    endScheduleTime.setHours(Number.parseInt(endHour));
    endScheduleTime.setMinutes(Number.parseInt(endMinute));
    if (this.schedules && this.schedules[this.schedules.length - 1].schedulingDateAndTime > endScheduleTime) {
      endScheduleTime = this.schedules[this.schedules.length - 1].schedulingDateAndTime;
    }

    while (scheduleTime < endScheduleTime) {
      var interval = new ScheduleInterval();
      interval.id = new Date(scheduleTime);
      interval.timeInterval = this.schedulerParams.timeIntervalInMinutes;

      var timeWithInterval = new Date(scheduleTime);
      timeWithInterval.setMinutes(scheduleTime.getMinutes() + this.schedulerParams.timeIntervalInMinutes);
      this.schedules.forEach(schedule => {
        if (schedule.schedulingDateAndTime > interval.id && schedule.schedulingDateAndTime < timeWithInterval)
          interval.times.push(schedule);
      });

      this.availableScheduleTimes.push(interval);
      scheduleTime = new Date(scheduleTime.setMinutes(scheduleTime.getMinutes() + this.schedulerParams.timeIntervalInMinutes));
    }


  }

  loadScheduleByDate() {
    var schedule = new ScheduleInfo();
    schedule.id = 1;
    schedule.isConfirmed = true;
    schedule.schedulingDateAndTime = new Date();

    schedule.patient = new PatientInfo();
    schedule.patient.id = 1;
    schedule.patient.fullName = 'Vinícios de Araújo Rodrigues';

    schedule.professional = new Professional();
    schedule.professional.id = 1;
    schedule.professional.fullName = "Dra Marcella Amorim";

    this.schedules.push(schedule);

    this.schedules.sort((a, b) => a.schedulingDateAndTime.getTime() - b.schedulingDateAndTime.getTime());
  }


  loadResponsibles() {
    this.loading = true;
    var pageSettings = new Pageable();
    pageSettings.size = 50;
    this.professionalService.getPage(null, pageSettings).then(response => {
      this.loading = false;
      if (!response.content || !response.content.length) {
        this.notification.showWarning("Nenhum profissional encontrado com a especialidade selecionada");
      }
      this.responsibles = response.content;
    }).catch(e => {
      this.loading = false;
      this.responsibles = [];
    });
  }

  onSelect(event) {
    console.log(event);
    this.selectedDate = event;
  }

}

export class ScheduleInterval {
  id: Date;
  timeInterval: number;
  times: ScheduleInfo[] = [];
}
