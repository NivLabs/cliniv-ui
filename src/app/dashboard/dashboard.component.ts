import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { UtilService } from 'app/core/util.service';
import { Sticker } from 'app/model/Sticker';
import { IStepOption, TourService } from 'ngx-ui-tour-md-menu';
import { Subscription } from 'rxjs';
import { NotificationsComponent } from '../core/notification/notifications.component';
import { Dashboard, DashboardService } from './dashboard.service';
import { StickerEditComponent } from './sticker-edit/sticker-edit.component';

const DASHBOARD_TOUR_SEEN_KEY = '__dashboard_tour_seen';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  loading: boolean = false;
  data: Dashboard = new Dashboard();
  logoName = 'cliniv';
  private tourEndSubscription: Subscription;

  private readonly tourSteps: IStepOption[] = [
    {
      anchorId: 'dashboardStats',
      title: 'Resumo do dia',
      content: 'Aqui você acompanha, em tempo real, os novos pacientes, atendidos, cancelados e confirmados de hoje.',
      enableBackdrop: true,
      isAsync: true
    },
    {
      anchorId: 'dashboardAppointments',
      title: 'Agendamentos confirmados',
      content: 'Os agendamentos já confirmados para hoje aparecem nesta lista.',
      enableBackdrop: true,
      isAsync: true
    },
    {
      anchorId: 'dashboardProfessionalStats',
      title: 'Suas estatísticas',
      content: 'Um resumo pessoal: seus atendimentos ativos, quantos pacientes você já atendeu hoje e quantos agendamentos ainda não foram confirmados.',
      enableBackdrop: true,
      isAsync: true
    },
    {
      anchorId: 'dashboardStickers',
      title: 'Lembretes',
      content: 'Crie lembretes rápidos clicando no ícone "+" e acompanhe-os por aqui.',
      enableBackdrop: true,
      isAsync: true,
      endBtnTitle: 'Concluir'
    }
  ];

  constructor(
    private dashboardService: DashboardService,
    private utilService: UtilService,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent,
    private dialog: MatDialog,
    private tourService: TourService) { }

  ngAfterViewInit(): void {
    this.tourService.initialize(this.tourSteps);
    this.tourEndSubscription = this.tourService.end$.subscribe(() => localStorage.setItem(DASHBOARD_TOUR_SEEN_KEY, 'true'));

    if (!localStorage.getItem(DASHBOARD_TOUR_SEEN_KEY)) {
      this.tourService.start();
    }
  }

  ngOnDestroy(): void {
    this.tourEndSubscription?.unsubscribe();
  }

  startTour(): void {
    this.tourService.start();
  }

  openDialog(sticker: Sticker): void {
    const dialogRef = this.dialog.open(StickerEditComponent, {
      width: '100%',
      height: 'auto',
      data: { selectedSticker: sticker }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  deleteSticker(id: number) {
    this.loading = true;
    this.dashboardService.deleteSticker(id).then(() => {
      this.loading = false;
      this.notification.showSucess("Lembrete excluído com sucesso!");
      this.ngOnInit();
    }).catch((err) => {
      this.loading = false;
      this.errorHandler.handle(err, null);
    });
  }

  ngOnInit() {
    this.loading = true;
    this.logoName = this.utilService.getLogo();
    this.dashboardService.getDashboardInfo().then((resp) => {
      this.data = resp;
      this.loading = false;
    }).catch((err) => {
      this.loading = false;
      this.errorHandler.handle(err, null);
    });

  }
}
