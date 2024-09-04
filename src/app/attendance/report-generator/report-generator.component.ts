import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { DocumentViewerComponent } from 'app/component/document-viewer/document-viewer.component';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { Pageable } from 'app/model/Util';
import { ProfessionalService } from 'app/professional/professional.service';
import { AttendanceService } from '../attendance.service';

export class AttendanceReportParams {
  responsibleId: number;
  month: number;
  year: number;
}

@Component({
  selector: 'app-report-generator',
  templateUrl: './report-generator.component.html',
  styleUrls: ['./report-generator.component.css']
})
export class ReportGeneratorComponent implements OnInit {

  loading: boolean;
  responsibles: any;
  dataToForm: AttendanceReportParams;
  responsibleControl = new UntypedFormControl();

  constructor(
    private professionalService: ProfessionalService,
    private notification: NotificationsComponent,
    public dialog: MatDialog,
    private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.dataToForm = new AttendanceReportParams();
    this.loadResponsibles();
  }

  selectResponsible(id: number) {
    this.dataToForm.responsibleId = id;
  }

  openDocumentViewerDialog(): void {
    this.loading = true;
    this.attendanceService.generateReport(this.dataToForm).then(resp => {
      this.loading = false;
      console.log(resp);
      this.dialog.open(DocumentViewerComponent, {
        width: '100%',
        height: 'auto',
        data: { selectedDigitalDocumentId: 0, document: resp }
      });
    }).finally(() => this.loading = false);
  }


  /**
   * Carrega os profissionais para o filtro de atendimento
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
    }).finally(() => this.loading = false);
  }
}
