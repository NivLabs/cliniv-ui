import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { PatientService } from './patient.service';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { Page, Pageable } from 'app/model/Util';
import { PatientFilters } from '../model/Patient'
import { ActivatedRoute, Router } from '@angular/router';
import { IStepOption, TourService } from 'ngx-ui-tour-md-menu';
import { Subscription } from 'rxjs';
import { DataTableColumn } from '../components/data-table/data-table.component';
import { formatCpf, formatDate, formatPhone } from '../model/format.util';

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

  columns: Array<DataTableColumn> = [
    {
      key: 'fullName', label: 'Nome',
      cell: row => row.fullName + (row.type === 'NOT_IDENTIFIED' ? ' [Não Identificado]' : ''),
      cellClass: row => row.type === 'NOT_IDENTIFIED' ? 'name-not-identified' : '',
      sortable: true, sortKey: 'person.fullName'
    },
    { key: 'id', label: 'Matrícula', sortable: true },
    { key: 'cnsNumber', label: 'CNS', cell: row => row.cnsNumber || '-', sortable: true },
    { key: 'bornDate', label: 'Nascimento', cell: row => formatDate(row.bornDate), sortable: true, sortKey: 'person.bornDate' },
    {
      key: 'gender', label: 'Gênero', cell: row => row.gender === 'M' ? 'Masculino' : (row.gender === 'F' ? 'Feminino' : '-'),
      sortable: true, sortKey: 'person.gender'
    },
    { key: 'cpf', label: 'CPF', cell: row => row.cpf ? formatCpf(row.cpf) : '-', sortable: true, sortKey: 'person.cpf' },
    {
      key: 'principalNumber', label: 'Telefone', cell: row => formatPhone(row.principalNumber),
      sortable: true, sortKey: 'person.principalNumber'
    }
  ];

  getRowClass = (row: any) => row.type === 'NOT_IDENTIFIED' ? 'row-danger' : 'row-active';

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
    this.page = new Page();
    this.filters = new PatientFilters();
    this.pageSettings = new Pageable();
    this.fetch(() => {
      if (patientIdFromUrl) {
        this.openDialog(Number.parseInt(patientIdFromUrl));
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSettings.page = event.pageIndex;
    this.pageSettings.size = event.pageSize;
    this.fetch();
  }

  onSortChange(sort: Sort) {
    this.pageSettings.page = 0;
    if (sort.direction) {
      this.pageSettings.orderBy = sort.active;
      this.pageSettings.direction = sort.direction.toUpperCase() as 'ASC' | 'DESC';
    } else {
      delete this.pageSettings.orderBy;
      delete this.pageSettings.direction;
    }
    this.fetch();
  }

  private fetch(onSuccess?: () => void) {
    this.loading = true;
    this.principalService.getPage(this.filters, this.pageSettings).then(response => {
      this.loading = false;
      this.datas = response.content;
      this.page = response;
      this.dataNotFound = this.datas.length === 0;
      if (onSuccess) {
        onSuccess();
      }
    }).catch(error => {
      this.dataNotFound = this.datas ? this.datas.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  applyFilter() {
    if (this.filters) {
      this.pageSettings.page = 0;
      this.fetch();
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
