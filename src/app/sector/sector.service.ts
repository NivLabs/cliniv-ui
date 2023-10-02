import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { AppHttp } from "app/security/app-http";
import { Sector, SectorFilters } from 'app/model/Sector';
import { Page, Pageable } from 'app/model/Util';
import { Accommodation } from 'app/model/Accommodation';
import { HttpHeaders } from "@angular/common/http";

@Injectable()
export class SectorService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/sector`;
    }

    getById(id): Promise<Sector> {
        if (id) {
            return this.http.get<Sector>(`${this.baseUrl}/${id}`).toPromise();
        }
    }

    getPage(filter: SectorFilters, pageSettings: Pageable): Promise<Page> {
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

    update(sector): Promise<Sector> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (sector) {
            return this.http.put<Sector>(`${this.baseUrl}/${sector.id}`, sector, { headers }).toPromise();
        }
    }

    create(sector): Promise<Sector> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (sector) {
            return this.http.post<Sector>(this.baseUrl, sector, { headers }).toPromise();
        }
    }

    saveOrUpdateAccommodation(accommodation): Promise<Accommodation> {
        if (accommodation.id) {
            return this.updateAccommodation(accommodation);
        } else {
            return this.createAccommodation(accommodation);
        }
    }

    createAccommodation(accommodation): Promise<Accommodation> {
        if (accommodation) {
            return this.http.post<Accommodation>(`${this.baseUrl}/room-or-bed`, accommodation).toPromise();
        }
    }

    updateAccommodation(accommodation): Promise<Accommodation> {
        if (accommodation) {
            return this.http.put<Accommodation>(`${this.baseUrl}/room-or-bed/${accommodation.id}`, accommodation).toPromise();
        }
    }

    deleteAccommodation(accommodationId): Promise<void> {
        if (accommodationId) {
            return this.http.delete<void>(`${this.baseUrl}/room-or-bed/${accommodationId}`).toPromise();
        }
    }

}