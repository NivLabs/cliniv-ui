import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { AppHttp } from "app/security/app-http";
import { Report, ReportFilters } from 'app/model/Report';
import { Page, Pageable } from 'app/model/Util';

@Injectable()
export class ReportService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/report`;
    }

    getById(id): Promise<Report> {
        var headers = this.http.getHeadersDefault();
        if (id) {
            return this.http.get<Report>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }

    getPage(filter: ReportFilters, pageSettings: Pageable): Promise<Page> {
        var headers = this.http.getHeadersDefault();
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
        return this.http.get<Page>(`${this.baseUrl}?${queryString}`, { headers }).toPromise();
    }

    create(report): Promise<Report> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (report) {
            return this.http.post<Report>(this.baseUrl, report, { headers }).toPromise();
        }
    }

    update(report): Promise<Report> {

        var object = {
            id: report.id,
            base64: report.base64,
            name: report.name,
            type: report.type
        };

        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (report) {
            return this.http.put<Report>(`${this.baseUrl}/${report.id}`, object, { headers }).toPromise();
        }
    }

    delete(reportId): Promise<void> {
        var headers = this.http.getHeadersDefault();

        if (reportId) {
            return this.http.delete<void>(`${this.baseUrl}/${reportId}`, { headers }).toPromise();
        }
    }

    createReport(report, layoutId): Promise<any> {
        var headers = this.http.getHeadersDefault();

        if (report) {
            return this.http.post<any>(`${this.baseUrl}/${layoutId}`, report, { headers }).toPromise();
        }
    }

}