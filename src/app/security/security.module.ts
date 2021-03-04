import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { JwtModule } from '@auth0/angular-jwt';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { environment } from '../../environments/environment';
import { AppHttp } from './app-http';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupComponent } from './login-form/signup/signup.component';
import { SecurityRoutingModule } from './security-routing.module';
import { ForgotPasswordComponent } from './login-form/forgot-password/forgot-password.component';




const maskConfig: Partial<IConfig> = {
  validation: true,
};


export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatInputModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.tokenWhitelistedDomains,
        blacklistedRoutes: environment.tokenBlacklistedRoutes
      }
    }),
    NgxMaskModule.forRoot(maskConfig),
    SecurityRoutingModule
  ],
  declarations: [
    LoginFormComponent,
    SignupComponent,
    ForgotPasswordComponent
  ],
  entryComponents: [
    SignupComponent,
    ForgotPasswordComponent
  ],
  providers: [
    AuthGuard, AuthService, AppHttp
  ]
})
export class SecurityModule { }