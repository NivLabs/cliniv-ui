import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { Pageable } from 'app/model/Util';
import { ProfessionalService } from 'app/professional/professional.service';
import { ScheduleFilter, ScheduleParameters } from '../model/Schedule';

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
  availableScheduleTimes: any;
  public responsibles: any;
  public loading = false;
  public selectedDate: any;
  public schedulerParams: ScheduleParameters = new ScheduleParameters();

  constructor(private professionalService: ProfessionalService, private notification: NotificationsComponent) { }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.loadResponsibles();
    this.mountSchedule();
  }

  mountSchedule() {
    this.availableScheduleTimes = [];

    var initHour = this.schedulerParams.initialAttendanceTime.split(":")[0];
    var initMinute = this.schedulerParams.initialAttendanceTime.split(":")[1];
    var scheduleTime = new Date();;
    scheduleTime.setHours(Number.parseInt(initHour));
    scheduleTime.setMinutes(Number.parseInt(initMinute));


    var endHour = this.schedulerParams.endAttendanceTime.split(":")[0];
    var endMinute = this.schedulerParams.endAttendanceTime.split(":")[1];
    var endScheduleTime = new Date();
    endScheduleTime.setHours(Number.parseInt(endHour));
    endScheduleTime.setMinutes(Number.parseInt(endMinute));

    while (scheduleTime < endScheduleTime) {
      this.availableScheduleTimes.push(new Date(scheduleTime));
      scheduleTime = new Date(scheduleTime.setMinutes(scheduleTime.getMinutes() + this.schedulerParams.timeIntervalInMinutes));
    }


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
