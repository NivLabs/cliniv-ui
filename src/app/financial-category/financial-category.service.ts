import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Page, Pageable } from 'app/model/Util';
import { FinancialCategory, FinancialCategoryFilters } from 'app/model/FinancialCategory';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class FinancialCategoryService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/financial-category`;
    }

    getPage(filter: FinancialCategoryFilters, pageSettings: Pageable): Promise<Page> {
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

    create(category: FinancialCategory): Promise<FinancialCategory> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.post<FinancialCategory>(`${this.baseUrl}`, category, { headers }).toPromise();
    }

    update(category: FinancialCategory): Promise<FinancialCategory> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.put<FinancialCategory>(`${this.baseUrl}/${category.id}`, category, { headers }).toPromise();
    }
}
