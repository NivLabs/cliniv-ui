import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module'
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SecurityModule } from './security/security.module';
import { SecurityRoutingModule } from './security/security-routing.module';
import { AdminLayoutModule } from './layouts/admin-layout/admin-layout.module';
import { SectorEditComponent } from './sector/sector-edit/sector-edit.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';

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
    SectorEditComponent,
    UserComponent,
    UserEditComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
