import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { PatientService } from './patient.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { MatDialog } from '@angular/material/dialog';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { Page, Pageable } from 'app/model/Util';
import { PatientFilters } from '../model/Patient'
import { ActivatedRoute, Router } from '@angular/router';
import { IStepOption, TourService } from 'ngx-ui-tour-md-menu';
import { Subscription } from 'rxjs';

const PATIENT_TOUR_SEEN_KEY = '__patient_tour_seen';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit, AfterViewInit, OnDestroy {

  public loading: boolean;
  public dataNotFound: boolean;
  datas: Array<any>;
  page: Page;
  pageSettings: Pageable;
  filters: PatientFilters;
  private tourEndSubscription: Subscription;

  private readonly tourSteps: IStepOption[] = [
    {
      anchorId: 'patientFilters',
      title: 'Filtros de busca',
      content: 'Combine tipo de paciente, matrícula, CNS, nome, nome social e CPF para encontrar um paciente rapidamente. Aperte [ENTER] em qualquer campo pra aplicar.',
      enableBackdrop: true,
      isAsync: true
    },
    {
      anchorId: 'patientActions',
      title: 'Filtrar e cadastrar',
      content: '"Filtrar" aplica os campos preenchidos acima. "Novo Paciente" abre o cadastro de um paciente novo.',
      enableBackdrop: true,
      isAsync: true
    },
    {
      anchorId: 'patientResults',
      title: 'Resultados',
      content: 'Clique em qualquer paciente da lista para ver ou editar os dados completos.',
      enableBackdrop: true,
      isAsync: true
    }
  ];

  private readonly tourStepDefaults: IStepOption = {
    prevBtnTitle: 'Anterior',
    nextBtnTitle: 'Próximo',
    endBtnTitle: 'Concluir'
  };

  constructor(public dialog: MatDialog, private router: Router, private principalService: PatientService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent, private route: ActivatedRoute, private tourService: TourService) { }

  ngAfterViewInit(): void {
    this.tourService.initialize(this.tourSteps, this.tourStepDefaults);
    this.tourEndSubscription = this.tourService.end$.subscribe(() => localStorage.setItem(PATIENT_TOUR_SEEN_KEY, 'true'));

    if (!localStorage.getItem(PATIENT_TOUR_SEEN_KEY)) {
      this.tourService.start();
    }
  }

  ngOnDestroy(): void {
    this.tourEndSubscription?.unsubscribe();
  }

  ngOnInit() {
    var patientIdFromUrl = this.route.snapshot.paramMap.get('patientId');
    this.router.navigate(['patient']);
    this.loading = true;
    this.page = new Page();
    this.filters = new PatientFilters();
    this.pageSettings = new Pageable();
    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.datas = response.content;
      this.page = response;
      this.dataNotFound = this.datas.length === 0;
      if (patientIdFromUrl) {
        this.openDialog(Number.parseInt(patientIdFromUrl));
      }
    }).catch(error => {
      this.dataNotFound = this.datas ? this.datas.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  /**
   * Realiza a paginação dos componentes
   */
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

  applyFilter() {
    if (this.filters) {
      this.loading = true;
      this.pageSettings = new Pageable();
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
  }

  /**
  * 
  * Executa um evento à partir da tecla enter
  * 
  * @param event Evento de tecla
  */
  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }


  selectPatientType(newValue) {
    this.filters.type = newValue;
    this.applyFilter();
  }

  /**
   * 
   * @param id Identificador do paciente
   */
  openDialog(id): void {
    const dialogRef = this.dialog.open(PatientEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedPatient: id },

    });

    dialogRef.afterClosed().subscribe(result => {
      this.applyFilter();
    });
  }

}
