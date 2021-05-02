import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { ProcedureFilters, ProcedureInfo } from 'app/model/Procedure';
import { Page, Pageable } from 'app/model/Util';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ProcedureService {

  baseUrl: string;

  constructor(private http: AppHttp) {
    this.baseUrl = `${environment.apiUrl}/procedure`;
  }

  getPage(filter: ProcedureFilters, pageSettings: Pageable): Promise<Page> {
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

  getById(id): Promise<ProcedureInfo> {
    if (id) {
      return this.http.get<ProcedureInfo>(`${this.baseUrl}/${id}`).toPromise();
    }
  }

  update(request: ProcedureInfo): Promise<ProcedureInfo> {
    var headers = new HttpHeaders()
      .append('Content-Type', "application/json");
    if (request) {
      return this.http.put<ProcedureInfo>(`${this.baseUrl}/${request.id}`, request, { headers }).toPromise();
    }
  }

  create(request: ProcedureInfo): Promise<ProcedureInfo> {
    var headers = new HttpHeaders()
      .append('Content-Type', "application/json");
    if (request) {
      return this.http.post<ProcedureInfo>(this.baseUrl, request, { headers }).toPromise();
    }
  }

}
