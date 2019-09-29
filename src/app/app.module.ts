import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/prontuario/pages/login/login.component';
import { HomeComponent } from './modules/prontuario/pages/home/home.component';
import { NavComponent } from './modules/prontuario/pages/nav/nav.component';
import { ProfileComponent } from './modules/prontuario/pages/profile/profile.component';
import { AnamneseComponent } from './modules/prontuario/pages/anamnese/anamnese.component';
import { EventosComponent } from './modules/prontuario/pages/eventos/eventos.component';
import { HistoricoClinicoComponent } from './modules/prontuario/pages/historico-clinico/historico-clinico.component';
import { GestaoDeUsuariosComponent } from './modules/prontuario/pages/gestao-de-usuarios/gestao-de-usuarios.component';
import { ProntuarioModule } from './modules/prontuario/prontuario.module';
import { BorderComponent } from './prontuario/components/border/border.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { ButtonComponent } from './components/button/button.component';
import { ContainerComponent } from './components/container/container.component';
import { CardComponent } from './components/card/card.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { DragDropComponent } from './components/drag-drop/drag-drop.component';
import { HorizontalInfoComponent } from './components/horizontal-info/horizontal-info.component';
import { InputComponent } from './components/input/input.component';
import { ListComponent } from './components/list/list.component';
import { MenuComponent } from './components/menu/menu.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { RadioComponent } from './components/radio/radio.component';
import { SelectComponent } from './components/select/select.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { TableComponent } from './components/table/table.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TreeComponent } from './components/tree/tree.component';
import { VerticalInfoComponent } from './components/vertical-info/vertical-info.component';
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
    GestaoDeUsuariosComponent,
    BorderComponent,
    CheckboxComponent,
    ButtonComponent,
    ContainerComponent,
    CardComponent,
    DatepickerComponent,
    DialogComponent,
    DragDropComponent,
    HorizontalInfoComponent,
    InputComponent,
    ListComponent,
    MenuComponent,
    PageHeaderComponent,
    RadioComponent,
    SelectComponent,
    SideBarComponent,
    TableComponent,
    TabsComponent,
    ToolbarComponent,
    TreeComponent,
    VerticalInfoComponent
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
