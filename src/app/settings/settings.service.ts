import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { SeetingsInfo } from 'app/model/Settings';
import { Parameter } from 'app/model/Parameter';

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

  update(parameterId: number, value: any): Promise<void>{

    var headers = this.http.getHeadersDefault();

    return this.http.put<void>(`${environment.apiUrl}/parameter/${parameterId}/${value}`, { headers }).toPromise();

  }

}
