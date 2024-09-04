import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import { default as dayGridPlugin } from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { Pageable } from 'app/model/Util';
import { ProfessionalService } from 'app/professional/professional.service';
import { SettingsService } from 'app/settings/settings.service';
import { Appointment, AppointmentFilter, AppointmentInfo, AppointmentParameters } from '../model/Appointment';
import { AppointmentEditComponent } from './appointment-edit/appointment-edit.component';
import { AppointmentService } from './appointment.service';


const colors = [
  { status: 'CONFIRMED', color: '#0253e8' },
  { status: 'COMPLETED', color: '#38f005' },
  { status: 'CANCELED', color: '#e80202' },
  { status: 'MISSED', color: '#e80202' },
  { status: 'WAITING_CONFIRMATION', color: '#e4e802' },
  { status: 'RESCHEDULED', color: '#5f4bc4' }
];

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppointmentComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,list'
    },

    locale: 'pt-BR',
    buttonText: {
      today: 'hoje',
      month: 'mês',
      week: 'semana',
      day: 'dia',
      list: 'lista'
    },
    noEventsText: 'Nenhuma consulta para esta data',
    eventClick: this.openDialogWithAppointment.bind(this),
    datesSet: this.changeMonth.bind(this)
  };

  /**Hora início */
  public static INIT_SCHEDULE_PARAM_ID: number = 6;
  /** Hora fim */
  public static END_SCHEDULE_PARAM_ID: number = 7;
  /** Intervalo da agenda */
  public static INTERVAL_SCHEDULE_PARAM_ID: number = 7;
  private INIT_HOUR_DEFAULT: string = "00:00";
  private END_HOUR_DEFAULT: string = "23:59";

  public filters: AppointmentFilter = new AppointmentFilter();
  responsibleControl = new FormControl();
  confirmationSelectControl = new FormControl();
  statusSelectControl = new FormControl();

  currentEvents: EventApi[] = [];
  public responsibles: any;
  public loading = false;
  public schedulerParams: AppointmentParameters = new AppointmentParameters();

  constructor(private dialog: MatDialog,
    private errorHandler: ErrorHandlerService,
    private principalService: AppointmentService,
    private settingsService: SettingsService,
    private professionalService: ProfessionalService,
    private notification: NotificationsComponent,
    private changeDetector: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.initAppointmentSettingsByParameters();
    this.loadResponsibles()
      .then(() => this.loadAppointmentByFilters());

  }

  /**
   * Inicializa as configurações da agenda baseadas nas configurações da aplicação
   */
  private initAppointmentSettingsByParameters() {
    var initialAttendanceTime = this.settingsService.getParameters().find(param => param.id == AppointmentComponent.INIT_SCHEDULE_PARAM_ID);
    this.schedulerParams.initialAttendanceTime = initialAttendanceTime ? initialAttendanceTime.value : this.INIT_HOUR_DEFAULT;;

    var endAttendanceTime = this.settingsService.getParameters().find(param => param.id == AppointmentComponent.END_SCHEDULE_PARAM_ID);
    this.schedulerParams.endAttendanceTime = endAttendanceTime ? endAttendanceTime.value : this.END_HOUR_DEFAULT;

    var timeIntervalInMinutes = this.settingsService.getParameters().find(param => param.id == AppointmentComponent.INTERVAL_SCHEDULE_PARAM_ID);
    this.schedulerParams.timeIntervalInMinutes = timeIntervalInMinutes && Number.parseInt(timeIntervalInMinutes.value) > 0 ? timeIntervalInMinutes.value : 60;
  }

  /**
   * Carrega as informações necessárias para a Agenda
   */
  loadAppointmentByFilters() {
    this.loading = true;
    return this.principalService.getByFilter(this.filters).then(resp => {
      this.currentEvents = this.convertAppointmentsToCalendarEvents(resp.content);
      this.changeDetector.detectChanges();
      this.loading = false;
    }).catch(error => {
      this.currentEvents = [];
      this.changeDetector.detectChanges();
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

  selectResponsible(id) {
    this.filters.professionalId = id ? id : null;
    this.loadAppointmentByFilters();
  }

  selectStatus(status) {
    this.filters.status = status ? status : null;
    this.loadAppointmentByFilters();
  }

  openDialogWithAppointment(info) {
    this.loading = true;
    this.principalService.findById(info.event.id).then(schedule => {
      this.loading = false;
      const dialogRef = this.dialog.open(AppointmentEditComponent, {
        width: '100%',
        height: 'auto',
        data: { schedule, responsibles: this.responsibles, schedulerParams: this.schedulerParams }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loadAppointmentByFilters();
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
  openDialog(dateStr): void {
    if (dateStr) {
      var selectedDate = new Date(dateStr);
      selectedDate.setDate(selectedDate.getDate());
      var schedule = new AppointmentInfo();
    }
    const dialogRef = this.dialog.open(AppointmentEditComponent, {
      width: '100%',
      height: 'auto',
      data: { schedule, responsibles: this.responsibles }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadAppointmentByFilters();
    });
  }

  convertAppointmentsToCalendarEvents(appointments: Appointment[]): Array<EventApi> {
    let convertedList = [];

    appointments.forEach(item => {
      convertedList.push({
        id: item.id,
        title: item.patientName,
        date: item.schedulingDateAndTime,
        color: this.getColor(item.status)
      });
    });

    return convertedList;
  }

  getColor(status) {
    return colors.find(item => item.status === status).color;
  }

  changeMonth(event) {
    this.filters.startDate = event.startStr.split('T')[0];
    this.filters.endDate = event.endStr.split('T')[0];
    this.loadAppointmentByFilters();
  }
}