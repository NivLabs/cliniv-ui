import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { SeetingsInfo } from 'app/model/Settings';

@Injectable()
export class SettingsService {

  baseUrl: string;

  constructor(private http: AppHttp) {
    this.baseUrl = `${environment.apiUrl}/institute`;
  }

  getSettings(): Promise<SeetingsInfo> {

    var headers = this.http.getHeadersDefault();

    return this.http.get<SeetingsInfo>(`${this.baseUrl}`, { headers }).toPromise();

  }

  update(parameterId: number, value: any) {

    var headers = this.http.getHeadersDefault();

    this.http.put(`${environment.apiUrl}/parameter/${parameterId}/${value}`, { headers }).toPromise();

  }

}
