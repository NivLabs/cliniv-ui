import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { ProcedureFilters } from 'app/model/Procedure';
import { Page, Pageable } from 'app/model/Util';

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

  update(procedureId: number): Promise<void> {
    return this.http.put<void>(`${this.baseUrl}/${procedureId}`, {}).toPromise();
  }

}
