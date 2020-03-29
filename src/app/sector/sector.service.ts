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
        var headers = this.http.getHeadersDefault()
        if (id) {
            return this.http.get<Sector>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }

    getPageOfSectors(filter): Promise<Array<Sector>> {
        var headers = this.http.getHeadersDefault()
        if (!filter) {
            return this.http.get<Array<Sector>>(this.baseUrl, { headers }).toPromise();
        }
    }
}