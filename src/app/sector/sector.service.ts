import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { AppHttp } from "app/security/app-http";
import { Sector, SectorFilters } from 'app/model/Sector';
import { Page, Pageable } from 'app/model/Util';

@Injectable()
export class SectorService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/sector`;
    }

    getById(id): Promise<Sector> {
        var headers = this.http.getHeadersDefault();
        if (id) {
            return this.http.get<Sector>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }

    getListOfSectors(filter): Promise<Array<Sector>> {
        var headers = this.http.getHeadersDefault();
        if (!filter) {
            return this.http.get<Array<Sector>>(`${this.baseUrl}/list`, { headers }).toPromise();
        }
    }

    getPage(filter: SectorFilters, pageSettings: Pageable): Promise<Page> {
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

    update(sector): Promise<Sector> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (sector) {
            return this.http.put<Sector>(`${this.baseUrl}/${sector.id}`, sector, { headers }).toPromise();
        }
    }

    create(sector): Promise<Sector> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (sector) {
            return this.http.post<Sector>(this.baseUrl, sector, { headers }).toPromise();
        }
    }
}