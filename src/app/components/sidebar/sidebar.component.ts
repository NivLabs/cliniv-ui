import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/security/auth.service';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/patient', title: 'Pacientes', icon: 'people', class: '' },
  { path: '/visit', title: 'Prontuário', icon: 'content_paste', class: '' },
  { path: '/professional', title: 'Profissionais', icon: 'bubble_chart', class: '' },
  { path: '/maps', title: 'Setores', icon: 'location_on', class: '' },
  { path: '/notifications', title: 'Administrativo', icon: 'settings', class: '' },
  { path: '/user-profile', title: 'Perfil', icon: 'person', class: '' },
  { path: '/institute', title: 'Institucional', icon: 'house', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(
    private auth: AuthService,
    private router: Router) { }

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
