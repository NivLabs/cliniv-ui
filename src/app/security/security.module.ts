import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { AppHttp } from './app-http';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupComponent } from './login-form/signup/signup.component';
import { SecurityRoutingModule } from './security-routing.module';





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
    SecurityRoutingModule
  ],
  declarations: [
    LoginFormComponent,
    SignupComponent
  ],
  entryComponents: [
    SignupComponent
  ],
  providers: [
    AuthGuard, AuthService, AppHttp
  ]
})
export class SecurityModule { }