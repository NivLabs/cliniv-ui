import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProntuarioRoutingModule } from './prontuario-routing.module';
import { AnamneseComponent } from './pages/anamnese/anamnese.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { GestaoDeUsuariosComponent } from './pages/gestao-de-usuarios/gestao-de-usuarios.component';
import { HistoricoClinicoComponent } from './pages/historico-clinico/historico-clinico.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [AnamneseComponent, EventosComponent, GestaoDeUsuariosComponent, HistoricoClinicoComponent, HomeComponent, LoginComponent, ProfileComponent, NavComponent],
  imports: [
    CommonModule,
    ProntuarioRoutingModule
  ]
})
export class ProntuarioModule { }
