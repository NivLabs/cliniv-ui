import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/prontuario/components/login/login.component';
import { HomeComponent } from './modules/prontuario/components/home/home.component';
import { NavComponent } from './modules/prontuario/components/nav/nav.component';
import { ProfileComponent } from './modules/prontuario/components/profile/profile.component';
import { AnamneseComponent } from './modules/prontuario/components/anamnese/anamnese.component';
import { EventosComponent } from './modules/prontuario/components/eventos/eventos.component';
import { HistoricoClinicoComponent } from './modules/prontuario/components/historico-clinico/historico-clinico.component';
import { GestaoDeUsuariosComponent } from './modules/prontuario/components/gestao-de-usuarios/gestao-de-usuarios.component';
import { ProntuarioModule } from './modules/prontuario/prontuario.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavComponent,
    ProfileComponent,
    AnamneseComponent,
    EventosComponent,
    HistoricoClinicoComponent,
    GestaoDeUsuariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ProntuarioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
