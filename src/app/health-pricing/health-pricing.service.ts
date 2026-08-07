import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Page, Pageable } from 'app/model/Util';
import { HealthPricingTable, HealthPricingTableFilters } from 'app/model/HealthPricingTable';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HealthPricingService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/health-pricing`;
    }

    getPage(filter: HealthPricingTableFilters, pageSettings: Pageable): Promise<Page> {
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

    create(data: HealthPricingTable): Promise<HealthPricingTable> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.post<HealthPricingTable>(`${this.baseUrl}`, data, { headers }).toPromise();
    }

    update(data: HealthPricingTable): Promise<HealthPricingTable> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");
        return this.http.put<HealthPricingTable>(`${this.baseUrl}/${data.id}`, data, { headers }).toPromise();
    }

    delete(id: number): Promise<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
    }
}
