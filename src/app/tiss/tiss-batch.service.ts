import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Page, Pageable } from 'app/model/Util';
import { TissBatch, TissBatchFilters } from 'app/model/TissBatch';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class TissBatchService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/tiss/batch`;
    }

    getPage(filter: TissBatchFilters, pageSettings: Pageable): Promise<Page> {
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

    create(data: TissBatch): Promise<TissBatch> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.post<TissBatch>(`${this.baseUrl}`, data, { headers }).toPromise();
    }

    update(data: TissBatch): Promise<TissBatch> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.put<TissBatch>(`${this.baseUrl}/${data.id}`, data, { headers }).toPromise();
    }

    delete(id: number): Promise<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
    }
}
