import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { CoreModule } from './core/core.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { SecurityRoutingModule } from './security/security-routing.module';
import { SecurityModule } from './security/security.module';
import { ChangeSectorAndResponsibleComponent } from './visit/change-sector-and-responsible/change-sector-and-responsible.component';
import { ReportGeneratorComponent } from './attendance/report-generator/report-generator.component';


@NgModule({
   imports: [
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      ComponentsModule,
      RouterModule,
      CoreModule,
      SecurityModule,
      SecurityRoutingModule,
      AdminLayoutModule,
      AppRoutingModule
   ],
   declarations: [
      AppComponent,
      AdminLayoutComponent,
      ChangeSectorAndResponsibleComponent,
      ReportGeneratorComponent
   ],
   providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
