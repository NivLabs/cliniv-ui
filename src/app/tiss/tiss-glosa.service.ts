import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Page, Pageable } from 'app/model/Util';
import { TissGlosa, TissGlosaFilters } from 'app/model/TissGlosa';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class TissGlosaService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/tiss/glosa`;
    }

    getPage(filter: TissGlosaFilters, pageSettings: Pageable): Promise<Page> {
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

    create(data: TissGlosa): Promise<TissGlosa> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.post<TissGlosa>(`${this.baseUrl}`, data, { headers }).toPromise();
    }

    update(data: TissGlosa): Promise<TissGlosa> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.put<TissGlosa>(`${this.baseUrl}/${data.id}`, data, { headers }).toPromise();
    }

    delete(id: number): Promise<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
    }
}
