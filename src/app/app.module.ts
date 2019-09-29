import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProntuarioModule } from './modules/prontuario/prontuario.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TooltipModule.forRoot(),
    ProntuarioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
