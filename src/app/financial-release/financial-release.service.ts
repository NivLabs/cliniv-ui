import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Page, Pageable } from 'app/model/Util';
import { FinancialRelease, FinancialReleaseFilters } from 'app/model/FinancialRelease';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class FinancialReleaseService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/financial-release`;
    }

    getPage(filter: FinancialReleaseFilters, pageSettings: Pageable): Promise<Page> {
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

    create(release: FinancialRelease): Promise<FinancialRelease> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.post<FinancialRelease>(`${this.baseUrl}`, release, { headers }).toPromise();
    }

    update(release: FinancialRelease): Promise<FinancialRelease> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.put<FinancialRelease>(`${this.baseUrl}/${release.id}`, release, { headers }).toPromise();
    }
}
