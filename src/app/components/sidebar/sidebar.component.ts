import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/security/auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/schedule', title: 'Agenda', icon: 'schedule', class: '' },
  { path: '/user-profile', title: 'Perfil', icon: 'person', class: '' },
  { path: '/patient', title: 'Pacientes', icon: 'people', class: '' },
  { path: '/visit', title: 'Prontuário', icon: 'content_paste', class: '' },
  { path: '/attendance', title: 'Atendimentos', icon: 'assignment_ind', class: '' },
  { path: '/professional', title: 'Profissionais', icon: 'bubble_chart', class: '' },
  { path: '/sector', title: 'Setores', icon: 'location_on', class: '' },
  { path: '/speciality', title: 'Especialidades', icon: 'format_list_bulleted', class: '' },
  { path: '/anamnesis-forms', title: "Anamnese Conf.", icon: 'content_paste', class: '' },
  { path: '/health-operator', title: 'Operadoras', icon: 'credit_card', class: '' },
  { path: '/user', title: 'Usuários', icon: 'lock', class: '' },
  { path: '/procedure', title: 'Procedimentos', icon: 'assignment_turned_in', class: '' },
  { path: '/settings', title: 'Configurações', icon: 'settings', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  personName: string;


  constructor(
    private auth: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService) {
    const token = localStorage.getItem('token');
    this.personName = this.jwtHelper.decodeToken(token) !== null ? this.jwtHelper.decodeToken(token).personName : '';
    this.personName = this.personName.split(" ")[0];
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
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
}
