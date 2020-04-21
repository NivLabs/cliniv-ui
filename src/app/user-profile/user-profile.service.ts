import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';
import { UserInfo } from 'app/model/User';
import { UpdatePassword } from 'app/model/UpdatePassword';

@Injectable()
export class UserProfileService {

  resourceUrl: string;

  constructor(private http: AppHttp) {
    this.resourceUrl = `${environment.apiUrl}/profile`;
  }

  getMe(): Promise<UserInfo> {
    var headers = this.http.getHeadersDefault()
    return this.http.get<UserInfo>(`${this.resourceUrl}`, { headers })
      .toPromise();
  }

  save(userInfo: UserInfo): Promise<UserInfo> {
    var validUserInfo = this.validAddress(userInfo);
    var headers = this.http.getHeadersDefault()
    return this.http.put<UserInfo>(`${this.resourceUrl}/${validUserInfo.id}`, validUserInfo, { headers })
      .toPromise();
  }

  validAddress(userInfo: UserInfo): UserInfo {
    var validUserInfo = new UserInfo();
    validUserInfo = JSON.parse(JSON.stringify(userInfo));
    return validUserInfo;
  }

  changePassword(updatePasswordRequest: UpdatePassword) {
    if (updatePasswordRequest) {
      var headers = this.http.getHeadersDefault()
        .append('Content-Type', "application/json");
      return this.http.put<UserInfo>(`${environment.apiUrl}/auth/password`, updatePasswordRequest, { headers }).toPromise();
    }
  }
}