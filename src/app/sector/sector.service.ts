import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { AppHttp } from "app/security/app-http";
import { Sector } from 'app/model/Sector'

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
            return this.http.get<Array<Sector>>(this.baseUrl, { headers }).toPromise();
        }
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