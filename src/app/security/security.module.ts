import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { JwtModule } from '@auth0/angular-jwt';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { AppHttp } from './app-http';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { CustomerService } from './login-form/customer.service';
import { ForgotPasswordComponent } from './login-form/forgot-password/forgot-password.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupComponent } from './login-form/signup/signup.component';
import { SecurityRoutingModule } from './security-routing.module';
import { PublicScheduleComponent } from 'app/professional/public-schedule/public-schedule.component';




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
        tokenGetter: tokenGetter
      }
    }),
    NgxMaskModule.forRoot(maskConfig),
    SecurityRoutingModule
  ],
  declarations: [
    LoginFormComponent,
    PublicScheduleComponent,
    SignupComponent,
    ForgotPasswordComponent
  ],
  entryComponents: [
    SignupComponent,
    ForgotPasswordComponent
  ],
  providers: [
    AuthGuard,
    AuthService,
    CustomerService,
    AppHttp,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class SecurityModule { }