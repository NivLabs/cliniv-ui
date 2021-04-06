import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorHandlerService } from './error-handler.service';
import { AddressService } from './address.service';
import { UtilService } from './util.service';
import { NotificationsComponent } from './notification/notifications.component';

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