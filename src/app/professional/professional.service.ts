import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Professional } from 'app/model/Professional';
import { Page, Pageable } from 'app/model/Util';

@Injectable()
export class ProfessionalService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/responsible`;
    }

    getById(id): Promise<Professional> {
        var headers = this.http.getHeadersDefault();
        if (id) {
            return this.http.get<Professional>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }

    getPage(filter, pageSettings: Pageable): Promise<Page> {
        var headers = this.http.getHeadersDefault();
        var queryString = ""
        if (filter) {
            let params = new URLSearchParams();
            for (let key in filter) {
                params.set(key, filter[key])
            }
            queryString = queryString + params.toString();
        }
        if (pageSettings) {
            let params = new URLSearchParams();
            for (let key in pageSettings) {
                params.set(key, pageSettings[key])
            }
            queryString = queryString + params.toString();

        }
        return this.http.get<Page>(`${this.baseUrl}?${queryString}`, { headers }).toPromise();
    }


    getByCpf(cpf: string): Promise<Professional> {
        var headers = this.http.getHeadersDefault();
        if (cpf) {
            return this.http.get<Professional>(`${this.baseUrl}/CPF/${cpf}`, { headers }).toPromise();
        }
    }

    create(professional: Professional): Promise<Professional> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (professional) {
            return this.http.post<Professional>(`${this.baseUrl}`, professional, { headers }).toPromise();
        }
    }

    update(professional: Professional): Promise<Professional> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (professional) {
            return this.http.put<Professional>(`${this.baseUrl}/${professional.id}`, professional, { headers }).toPromise();
        }
    }
}