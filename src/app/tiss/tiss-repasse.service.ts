import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Page, Pageable } from 'app/model/Util';
import { TissRepasse, TissRepasseFilters } from 'app/model/TissRepasse';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class TissRepasseService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/tiss/repasse`;
    }

    getPage(filter: TissRepasseFilters, pageSettings: Pageable): Promise<Page> {
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

    create(data: TissRepasse): Promise<TissRepasse> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.post<TissRepasse>(`${this.baseUrl}`, data, { headers }).toPromise();
    }

    update(data: TissRepasse): Promise<TissRepasse> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.put<TissRepasse>(`${this.baseUrl}/${data.id}`, data, { headers }).toPromise();
    }

    delete(id: number): Promise<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
    }
}
