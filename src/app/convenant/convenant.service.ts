import { Injectable } from "@angular/core";
import { AppHttp } from "app/security/app-http";
import { environment } from "environments/environment";
import { Page, Pageable } from "app/model/Util";
import { ConvenantFilter } from "app/model/Convenant";

@Injectable()
export class ConvenantService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/convenant`;
    }

    getPage(filter: ConvenantFilter, pageSettings: Pageable): Promise<Page> {
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
}