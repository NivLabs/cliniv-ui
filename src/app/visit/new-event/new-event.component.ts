import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { AttendanceService } from 'app/attendance/attendance.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { UtilService } from 'app/core/util.service';
import { DocumentTemplateService } from 'app/document-template/document-template.service';
import { Accommodation } from 'app/model/Accommodation';
import { NewAttendanceEvent } from 'app/model/Attendance';
import { DocumentTemplate, DocumentTemplateFilter } from 'app/model/DocumentTemplate';
import { FileInfo } from 'app/model/File';
import { ProcedureFilters, ProcedureInfo } from 'app/model/Procedure';
import { Professional } from 'app/model/Professional';
import { Sector, SectorFilters } from 'app/model/Sector';
import { Pageable } from 'app/model/Util';
import { ProcedureService } from 'app/procedure/procedure.service';
import { SectorService } from 'app/sector/sector.service';
import { MedicalRecordService } from '../medical-record.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {


  loading = false;
  selectedDocumentTemplate = false;

  eventTypeControl = new UntypedFormControl('10', [Validators.required]);
  sectorControl = new UntypedFormControl('', [Validators.required]);
  accommodationControl = new UntypedFormControl('', [Validators.required]);
  responsibleControl = new UntypedFormControl('', [Validators.required]);
  procedureControl = new UntypedFormControl('', []);
  documentTemplateControl = new UntypedFormControl('', []);

  responsibles: Array<Professional> = [];
  sectors: Array<Sector> = [];
  accommodations: Array<Accommodation> = [];
  documentTemplates: Array<DocumentTemplate> = [];

  dataToForm: NewAttendanceEvent;

  sectorFilters = new SectorFilters();
  documentTemplateFilters = new DocumentTemplateFilter();
  pageSettings = new Pageable();

  @ViewChild('inputFile')
  inputFile: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<NewEventComponent>,
    public attendanceService: AttendanceService,
    public sectorService: SectorService,
    public documentTemplateService: DocumentTemplateService,
    public notification: NotificationsComponent,
    public utilService: UtilService,
    public visitService: MedicalRecordService,
    public medicalRecService: MedicalRecordService,
    public procedureService: ProcedureService,
    private errorHandler: ErrorHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.pageSettings.size = 100;
  }

  ngOnInit(): void {
    const data = this.dialogRef.componentInstance.data;
    if (this.dialogRef.componentInstance.data) {
      this.dataToForm = new NewAttendanceEvent();
      this.dataToForm.attendanceId = data.attendanceId;
      this.dataToForm.accommodation = data.lastAccommodation ? data.lastAccommodation : new Accommodation();
      this.dataToForm.documents = [];
      this.dataToForm.responsible = new Professional();
      this.dataToForm.procedure = new ProcedureInfo();
    }
    this.loadSectors();
    this.loadDocumentTemplates();
    this.procedureControl.registerOnChange((value) => {
      this.dataToForm.procedure.id = value;
    });
  }


  /**
   * Busca os setores e seleciona o primeiro encontrado
   */
  loadSectors() {
    if (this.sectors?.length) {
      this.sectorControl.setValue(this.sectors[0].id);
      var event = { value: this.dataToForm.accommodation.sectorId };
      this.loadAccommodations(event);
    } else {
      this.loading = true;
      this.sectorService.getPage(this.sectorFilters, this.pageSettings).then(response => {
        this.sectors = response.content;
        this.sectorControl.setValue(this.dataToForm.accommodation.sectorId);
        var event = { value: this.dataToForm.accommodation.sectorId };
        this.loadAccommodations(event);
      }).catch(e => this.errorHandler.handle(e, this.dialogRef))
        .then(() => this.loading = false);
    }
  }

  /**
   * Busca dados de templates de documentos
   */
  loadDocumentTemplates() {
    if (this.documentTemplates?.length == 0) {
      this.loading = true;
      this.documentTemplateService.getPage(this.documentTemplateFilters, this.pageSettings).then(response => {
        this.documentTemplates = response.content;
      })
        .catch(e => this.errorHandler.handle(e, this.dialogRef))
        .then(() => this.loading = false);
    }
  }


  /**
   * Busca as acomodações à partir do identificador do setor
   * 
   * @param event Evento de change do Select
   */
  loadAccommodations(event: any) {
    var sectorId = event.value;
    if (sectorId) {
      this.loading = true;
      this.sectorService.getById(sectorId).then(response => {
        this.accommodations = response.listOfRoomsOrBeds;
        if (this.accommodations.length)
          this.accommodationControl.setValue(this.accommodations[0].id);
      }).catch(e => {
        this.accommodations = [];
        this.errorHandler.handle(e, this.dialogRef);
      }).then(() => this.loading = false);
    }
  }

  /**
   * Seleciona acomodação para o evento
   * 
   * @param id Identificador único da acomodação
   */
  selectAccommodation(id: number) {
    if (id) {
      this.dataToForm.accommodation.id = id;
    }
  }

  /**
   * 
   * @param id Seleciona um modelo de documento
   */
  selectDocumentTemplate(id: number) {
    if (id) {
      this.loading = true;
      this.documentTemplateService.findById(id).then(response => {
        this.selectedDocumentTemplate = true;
        this.dataToForm.observations = response.text;
      })
        .catch(e => this.errorHandler.handle(e, this.dialogRef))
        .then(() => this.loading = false);
    } else {
      this.selectedDocumentTemplate = false;
      this.dataToForm.observations = null;
    }
  }

  /**
   * Seleciona o tipo do evento
   * 
   * @param id Identificador único do tipo de evento
   */
  selectEventType(eventyType: string) {
    if (eventyType) {
      this.dataToForm.eventType = eventyType;
    }
  }

  /**
   * Busca procedimento por ID
   */
  searchProcedureById(event: any) {
    if (event.key === "Enter") {
      event.preventDefault();
      var id = this.dataToForm?.procedure?.id;
      if (id) {
        var procedureFilter = new ProcedureFilters();
        procedureFilter.id = id.toString();


        this.loading = true;
        this.procedureService.getPage(procedureFilter, new Pageable()).then(resultPage => {
          if (resultPage && resultPage.content.length) {
            this.dataToForm.procedure = resultPage.content[0];
          } else {
            this.notification.showWarning('Procedimento com o código ' + id + ' não encontrado');
          }
        }).then(() => this.loading = false);
      }
    }
  }

  /**
   * Cria um evento de prontuário
   * 
   * @param closeDialog Define se mantém o componente aberto ou fechado após o processo de criação de evento
   */
  createEvent(closeDialog: boolean) {
    this.loading = true;
    this.medicalRecService.createAttendanceEvent(this.dataToForm).then(resp => {
      if (closeDialog) {
        this.dialogRef.close();
        this.ngOnInit();
      }
      this.notification.showSucess("Evento criado com sucesso!");
    }).catch(e => this.errorHandler.handle(e, null))
      .then(() => this.loading = false);

  }

  addFile(fileInputEvent: any) {
    var t = this;
    var file = fileInputEvent.target.files[0];

    var reader = new FileReader();


    reader.onload = function (readerEvt) {
      var binaryString = readerEvt.target.result.toString();
      var fileInfo = new FileInfo();
      fileInfo.base64 = btoa(binaryString);
      fileInfo.name = file.name;
      t.dataToForm.documents.push(fileInfo);
      t.inputFile.nativeElement.value = '';
      t.loading = false;
    };

    this.loading = true;
    reader.readAsBinaryString(file);

  }

  cleanAttacheds() {
    this.dataToForm.documents = [];
  }

  onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

}
