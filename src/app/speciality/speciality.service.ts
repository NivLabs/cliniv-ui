import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Page, Pageable } from 'app/model/Util';
import { Speciality, SpecialityFilters } from 'app/model/Speciality';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class SpecialityService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/speciality`;
    }

    getById(id): Promise<Speciality> {
        if (id) {
            return this.http.get<Speciality>(`${this.baseUrl}/${id}`).toPromise();
        }
    }

    getPage(filter: SpecialityFilters, pageSettings: Pageable): Promise<Page> {
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

    create(speciality: Speciality): Promise<Speciality> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (speciality) {
            return this.http.post<Speciality>(`${this.baseUrl}`, speciality, { headers }).toPromise();
        }
    }

    update(speciality: Speciality): Promise<Speciality> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (speciality) {
            return this.http.put<Speciality>(`${this.baseUrl}/${speciality.id}`, speciality, { headers }).toPromise();
        }
    }

}