import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { CoreModule } from './core/core.module';
import { HealthOperatorEditComponent } from './healthOperator/health-operator-edit/health-operator-edit.component';
import { HealthOperatorComponent } from './healthOperator/health-operator.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { SecurityRoutingModule } from './security/security-routing.module';
import { SecurityModule } from './security/security.module';
import { DocumentSelectorComponent } from './visit/document-selector/document-selector.component';
import { HealthPlanComponent } from './healthOperator/health-plan/health-plan.component';

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
      DocumentSelectorComponent,
      HealthOperatorComponent,
      HealthOperatorEditComponent,
      HealthPlanComponent
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
