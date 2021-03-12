import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HealthOperator, HealthOperatorFilter } from "app/model/HealthOperator";
import { Page, Pageable } from "app/model/Util";
import { AppHttp } from "app/security/app-http";
import { environment } from "environments/environment";

@Injectable()
export class HealthOperatorService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/health-operator`;
    }

    getById(id): Promise<HealthOperator> {

        if (id) {
            return this.http.get<HealthOperator>(`${this.baseUrl}/${id}`).toPromise();
        }
    }

    getPage(filter: HealthOperatorFilter, pageSettings: Pageable): Promise<Page> {

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

    create(healthOperator): Promise<HealthOperator> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (healthOperator) {
            return this.http.post<HealthOperator>(this.baseUrl, healthOperator, { headers }).toPromise();
        }
    }

    update(healthOperator): Promise<HealthOperator> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (healthOperator) {
            return this.http.put<HealthOperator>(`${this.baseUrl}/${healthOperator.id}`, healthOperator, { headers }).toPromise();
        }
    }

}