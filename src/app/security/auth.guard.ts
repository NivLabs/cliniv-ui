import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard  {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivateChild(): boolean {
    return !(this.auth.isInvalidAccessToken() || !this.auth.getToken());
  }

  canLoad(): boolean {
    return !(this.auth.isInvalidAccessToken() || !this.auth.getToken());
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.auth.isInvalidAccessToken() || !this.auth.getToken()) {
      this.router.navigate(['/login']);
      return false;
    } else if (next.data.roles && !this.auth.hasAnyPermission(next.data.roles)) {
      return false;
    }
    return true;
  }
}