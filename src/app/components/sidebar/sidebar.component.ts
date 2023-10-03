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
  { path: '/appointment', title: 'Agenda', icon: 'schedule', class: '', collapse: false, routes: null },
  { path: '/patient', title: 'Pacientes', icon: 'people', class: '', collapse: false, routes: null },
  { path: '/visit', title: 'Prontuário', icon: 'content_paste', class: '', collapse: false, routes: null },
  { path: '/attendance', title: 'Atendimentos', icon: 'assignment_ind', class: '', collapse: false, routes: null },
  // { path: '/report', title: 'Relatórios', icon: 'list_alt', class: '', collapse: false, routes: null },
  {
    path: '', title: 'Outros Cadastros', icon: 'format_list_bulleted', class: '', collapse: true, routes: [
      { path: '/speciality', title: 'Especialidades', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/document-template', title: 'Modelos Doc.', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/dynamic-form', title: "Formulários", icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/health-operator', title: 'Operadoras', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/procedure', title: 'Procedimentos', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/professional', title: 'Profissionais', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/sector', title: 'Setores', icon: 'label_important', class: '', collapse: false, routes: null }
    ]
  },

  {
    path: '', title: 'Configurações', icon: 'settings', class: '', collapse: true, routes: [
      { path: '/user-profile', title: 'Perfil', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/user', title: 'Usuários', icon: 'label_important', class: '', collapse: false, routes: null },
      { path: '/settings', title: 'Instituição', icon: 'label_important', class: '', collapse: false, routes: null }

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

  active(element) {

    const lis = document.getElementsByClassName('active');

    if (lis) {

      if (lis.length > 1) {

        for (let li in lis) {
          if (lis.length != 0) {
            lis[0].classList.remove('active');
          }
        }
      }
      else {
        lis[0].classList.remove('active');
      }

    }

    element.parentElement.parentElement.classList.add('active');

  }

  activeToggle(element) {

    const lis = document.getElementsByClassName('active');

    if (lis) {

      if (lis.length > 1) {

        for (let li in lis) {
          if (lis.length != 0) {
            lis[0].classList.remove('active');
          }
        }
      }
      else {
        lis[0].classList.remove('active');
      }

    }

    element.parentElement.parentElement.parentElement.classList.add('active');

  }

}
