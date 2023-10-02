import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AddressService } from './address.service';
import { ErrorHandlerService } from './error-handler.service';
import { NotificationsComponent } from './notification/notifications.component';
import { UtilService } from './util.service';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [],
  providers: [
    ErrorHandlerService,
    AddressService,
    UtilService,
    NotificationsComponent
  ]
})
export class CoreModule { }