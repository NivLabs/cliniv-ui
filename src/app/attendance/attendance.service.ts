import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { AttendanceInfo, AttendanceFilters, NewAttendance } from 'app/model/Attendance';
import { Page, Pageable } from 'app/model/Util';
import { DigitalDocument } from 'app/model/DigitalDocument';

@Injectable()
export class AttendanceService {

  baseUrl: string;

  constructor(private http: AppHttp) {
    this.baseUrl = `${environment.apiUrl}/attendance`;
  }

  getById(id): Promise<AttendanceInfo> {
    if (id) {
      return this.http.get<AttendanceInfo>(`${this.baseUrl}/${id}`).toPromise();
    }
  }

  getPage(filter: AttendanceFilters, pageSettings: Pageable): Promise<Page> {
    var queryString;
    if (filter) {
      let params = new URLSearchParams();
      for (let key in filter) {
        if (filter[key]) {
          params.set(key, filter[key])
        }
      }
      queryString = params.toString();
    }
    if (pageSettings) {
      let params = new URLSearchParams();
      for (let key in pageSettings) {
        params.set(key, pageSettings[key])
      }
      queryString = queryString ? queryString + '&' + params.toString() : params.toString();

    }
    return this.http.get<Page>(`${this.baseUrl}?${queryString}`).toPromise();
  }

  generateReport(params: any): Promise<DigitalDocument> {
    if (params) {
      return this.http.post<DigitalDocument>(`${this.baseUrl}/report`, params).toPromise();
    }
  }

}
