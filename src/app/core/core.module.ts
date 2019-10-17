import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorHandlerService } from './error-handler.service';
import { NotificationsComponent } from './notification/notifications.component'

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
    NotificationsComponent
  ]
})
export class CoreModule { }