import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { SeetingsInfo } from 'app/model/Settings';
import { FileInfo } from 'app/model/File';

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

  updateInstitute(request: any): Promise<any> {
    var headers = this.http.getHeadersDefault().append('Content-Type', "application/json");

    return this.http.post<FileInfo>(`${this.baseUrl}`, request, { headers }).toPromise();
  }

  updateParameter(parameterId: number, value: any): Promise<void> {

    var headers = this.http.getHeadersDefault();

    return this.http.put<void>(`${environment.apiUrl}/parameter/${parameterId}`, { "newValue": value }, { headers }).toPromise();

  }

  saveLogo(file: FileInfo): Promise<FileInfo> {

    var headers = this.http.getHeadersDefault().append('Content-Type', "application/json");

    return this.http.post<FileInfo>(`${this.baseUrl}/logo`, file, { headers }).toPromise();

  }

}
