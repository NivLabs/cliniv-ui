import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Patient, PatientInfo } from 'app/model/Patient';
import { Page, Pageable } from 'app/model/Util';

@Injectable()
export class PatientService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/patient`;
    }

    getById(id): Promise<PatientInfo> {
        var headers = this.http.getHeadersDefault()
        if (id) {
            return this.http.get<PatientInfo>(`${this.baseUrl}/${id}`, { headers }).toPromise();
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

    getByCpf(cpf: string): Promise<PatientInfo> {
        var headers = this.http.getHeadersDefault()
        if (cpf) {
            return this.http.get<PatientInfo>(`${this.baseUrl}/CPF/${cpf}`, { headers }).toPromise();
        }
    }

    create(patient: PatientInfo): Promise<PatientInfo> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (patient) {
            return this.http.post<PatientInfo>(`${this.baseUrl}`, patient, { headers }).toPromise();
        }
    }

    update(patient: PatientInfo): Promise<PatientInfo> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (patient) {
            return this.http.put<PatientInfo>(`${this.baseUrl}/${patient.id}`, patient, { headers }).toPromise();
        }
    }
}