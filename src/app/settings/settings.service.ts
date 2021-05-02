import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { SetingsInfo as SetingsInfo } from 'app/model/Settings';
import { FileInfo } from 'app/model/File';
import { Parameter } from 'app/model/Parameter';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class SettingsService {

  baseUrl: string;
  private parameters: Array<Parameter> = [];

  constructor(private http: AppHttp) {
    this.baseUrl = `${environment.apiUrl}/institute`;
  }

  getParameters() {
    if (this.parameters.length == 0) {
      this.getSettings().then(resp => {
        this.parameters = resp.parameters;
      }).catch(erro => {
        this.parameters = [];
      });
    }
    return this.parameters;
  }

  getSettings(): Promise<SetingsInfo> {
    return this.http.get<SetingsInfo>(`${this.baseUrl}`).toPromise();

  }

  updateInstitute(request: any): Promise<any> {
    var headers = new HttpHeaders().append('Content-Type', "application/json");

    return this.http.post<FileInfo>(`${this.baseUrl}`, request, { headers }).toPromise();
  }

  updateParameter(parameterId: number, value: any): Promise<void> {
    return this.http.put<void>(`${environment.apiUrl}/parameter/${parameterId}`, { "newValue": value }).toPromise();
  }

  saveLogo(file: FileInfo): Promise<FileInfo> {
    var headers = new HttpHeaders().append('Content-Type', "application/json");
    return this.http.post<FileInfo>(`${this.baseUrl}/logo`, file, { headers }).toPromise();
  }

}
