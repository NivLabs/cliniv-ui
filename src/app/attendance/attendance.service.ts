import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { AttendanceInfo, AttendanceFilters } from 'app/model/Attendance';
import { Page, Pageable } from 'app/model/Util';

@Injectable()
export class AttendanceService {

  baseUrl: string;

  constructor(private http: AppHttp) {
    this.baseUrl = `${environment.apiUrl}/attendance`;
  }

  getById(id): Promise<AttendanceInfo> {
    var headers = this.http.getHeadersDefault()
    if (id) {
      return this.http.get<AttendanceInfo>(`${this.baseUrl}/${id}`, { headers }).toPromise();
    }
  }

  getPage(filter: AttendanceFilters, pageSettings: Pageable): Promise<Page> {
    var headers = this.http.getHeadersDefault();
    var queryString;
    if (filter) {
      let params = new URLSearchParams();
      for (let key in filter) {
        params.set(key, filter[key])
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
    return this.http.get<Page>(`${this.baseUrl}?${queryString}`, { headers }).toPromise();
  }

}
