import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UtilService } from 'app/core/util.service';
import { AuthService } from 'app/security/auth.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  collapse: boolean;
  routes: RouteInfo[]
}
export const ROUTES: RouteInfo[] = [

  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '', collapse: false, routes: null },
  {
    path: '', title: 'Financeiro', icon: 'attach_money', class: '', collapse: true, routes: [
      { path: '/financial-release', title: 'Lançamentos', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/financial-category', title: 'Categorias', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/health-pricing', title: 'Tabelas de Preço', icon: 'label_important', class: '', collapse: false, routes: null }
    ]
  },
  {
    path: '', title: 'Faturamento TISS', icon: 'description', class: '', collapse: true, routes: [
      { path: '/tiss/batch', title: 'Lotes TISS', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/tiss/glosa', title: 'Glosas', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/tiss/repasse', title: 'Repartes', icon: 'label_important', class: '', collapse: false, routes: null }
    ]
  },
  { path: '/appointment', title: 'Agenda', icon: 'schedule', class: '', collapse: false, routes: null },
  { path: '/patient', title: 'Pacientes', icon: 'people', class: '', collapse: false, routes: null },
  { path: '/visit', title: 'Prontuário', icon: 'content_paste', class: '', collapse: false, routes: null },
  { path: '/attendance', title: 'Atendimentos', icon: 'assignment_ind', class: '', collapse: false, routes: null },
  // { path: '/report', title: 'Relatórios', icon: 'list_alt', class: '', collapse: false, routes: null },
  {
    path: '', title: 'Outros Cadastros', icon: 'format_list_bulleted', class: '', collapse: true, routes: [
      { path: '/speciality', title: 'Especialidades', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/payment-methods', title: 'Formas Pgto.', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/dynamic-form', title: "Formulários", icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/document-template', title: 'Modelos Doc.', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/health-operator', title: 'Operadoras', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/procedure', title: 'Procedimentos', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/professional', title: 'Profissionais', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/sector', title: 'Setores', icon: 'label_important', class: '', collapse: false, routes: null }
    ]
  },

  {
    path: '', title: 'Configurações', icon: 'settings', class: '', collapse: true, routes: [
      { path: '/user-profile', title: 'Perfil', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/settings', title: 'Instituição', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/user', title: 'Usuários', icon: 'label_important', class: '', collapse: false, routes: null }

    ]
  }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  personName: string;
  logoName: string;
  sidebarFixed: boolean = false;

  private readonly SIDEBAR_FIXED_KEY = 'sidebar_fixed';

  constructor(
    private auth: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private utilService: UtilService) {
    const token = localStorage.getItem('token');
    this.personName = this.jwtHelper.decodeToken(token) !== null ? this.jwtHelper.decodeToken(token).personName : '';
    this.personName = this.personName.split(" ")[0];
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.logoName = this.utilService.getLogo();
    this.loadSidebarPreference();
    this.applySidebarState();
  }

  /**
   * Carrega a preferência de sidebar (fixado ou não) do localStorage
   */
  private loadSidebarPreference(): void {
    const stored = localStorage.getItem(this.SIDEBAR_FIXED_KEY);
    this.sidebarFixed = stored === 'true' ? true : false;
  }

  /**
   * Aplica o estado do sidebar (fixado ou não) ao DOM
   */
  private applySidebarState(): void {
    const body = document.getElementsByTagName('body')[0];
    const wrapper = document.querySelector('.wrapper');

    if (this.sidebarFixed) {
      body.classList.remove('sidebar-mini');
      if (wrapper) {
        wrapper.classList.add('sidebar-fixed');
      }
    } else {
      body.classList.add('sidebar-mini');
      if (wrapper) {
        wrapper.classList.remove('sidebar-fixed');
      }
    }
  }

  /**
   * Alterna entre sidebar fixado e não fixado
   */
  toggleSidebarFixed(): void {
    this.sidebarFixed = !this.sidebarFixed;
    localStorage.setItem(this.SIDEBAR_FIXED_KEY, this.sidebarFixed.toString());
    this.applySidebarState();
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  logoff() {
    this.auth.removeAccessToken();
    this.router.navigate(['/login'])
  }

  toggle(id) {

    const collapse = document.getElementById(id);
    const caret = document.getElementById('caret_' + id);

    if (collapse.classList.contains('show')) {
      collapse.classList.remove('show');
      caret.style.cssText = '';
    }
    else {

      collapse.classList.add('show');
      caret.style.cssText = 'transform: rotate(180deg)';
    }
  }

  active(event: Event) {
    this.markActiveNavItem(event);
  }

  activeToggle(event: Event) {
    this.markActiveNavItem(event);
  }

  /**
   * Marca o <li class="nav-item"> correspondente ao link clicado como 'active',
   * removendo o estado dos demais. Usa closest() a partir do elemento em que o
   * (click) foi registrado (currentTarget), em vez de contar níveis fixos de
   * parentElement — robusto independente de quanto o <a> esteja aninhado
   * (ex: <span class="sidebar-mini">/<span class="sidebar-normal"> por dentro).
   */
  private markActiveNavItem(event: Event): void {
    const link = event.currentTarget as HTMLElement;
    const navItem = link.closest('li.nav-item');
    if (!navItem) {
      return;
    }

    document.querySelectorAll('li.nav-item.active').forEach(li => li.classList.remove('active'));
    navItem.classList.add('active');
  }

}
