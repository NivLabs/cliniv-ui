import { Http, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JwtModule } from '@auth0/angular-jwt';

import { AuthGuard } from './auth.guard';
import { SecurityRoutingModule } from './security-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { AppHttp } from './app-http';



export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.tokenWhitelistedDomains,
        blacklistedRoutes: environment.tokenBlacklistedRoutes
      }
    }),
    SecurityRoutingModule
  ],
  declarations: [LoginFormComponent],
  providers: [
    AuthGuard, AuthService, AppHttp
  ]
})
export class SecurityModule { }