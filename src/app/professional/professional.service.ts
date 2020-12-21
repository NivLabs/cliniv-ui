import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Professional as ProfessionalInfo, ProfessionalFilters } from 'app/model/Professional';
import { Page, Pageable } from 'app/model/Util';

@Injectable()
export class ProfessionalService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/responsible`;
    }

    getById(id): Promise<ProfessionalInfo> {
        var headers = this.http.getHeadersDefault();
        if (id) {
            return this.http.get<ProfessionalInfo>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }

    getPage(filter: ProfessionalFilters, pageSettings: Pageable): Promise<Page> {
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


    getByCpf(cpf: string): Promise<ProfessionalInfo> {
        var headers = this.http.getHeadersDefault();
        if (cpf) {
            return this.http.get<ProfessionalInfo>(`${this.baseUrl}/CPF/${cpf}`, { headers }).toPromise();
        }
    }

    create(professional: ProfessionalInfo): Promise<ProfessionalInfo> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (professional) {
            return this.http.post<ProfessionalInfo>(`${this.baseUrl}`, professional, { headers }).toPromise();
        }
    }

    update(professional: ProfessionalInfo): Promise<ProfessionalInfo> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (professional) {
            return this.http.put<ProfessionalInfo>(`${this.baseUrl}/${professional.id}`, professional, { headers }).toPromise();
        }
    }
}