import { Injectable } from '@angular/core';

import { HttpHeaders } from '@angular/common/http';
import { DigitalDocument } from 'app/model/DigitalDocument';
import { PatientFilters, PatientInfo } from 'app/model/Patient';
import { Page, Pageable } from 'app/model/Util';
import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';

@Injectable()
export class PatientService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/patient`;
    }

    getById(id): Promise<PatientInfo> {
        if (id) {
            return this.http.get<PatientInfo>(`${this.baseUrl}/${id}`).toPromise();
        }
    }

    getPage(filter: PatientFilters, pageSettings: Pageable): Promise<Page> {
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

    getByDocument(documentType: string, documentValue: string): Promise<PatientInfo> {
        if (documentType && documentValue) {
            return this.http.get<PatientInfo>(`${this.baseUrl}/${documentType}/${documentValue}`).toPromise();
        }
    }

    create(patient: PatientInfo): Promise<PatientInfo> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (patient) {
            return this.http.post<PatientInfo>(`${this.baseUrl}`, patient, { headers }).toPromise();
        }
    }

    createPublic(patient: PatientInfo): Promise<PatientInfo> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (patient) {
            return this.http.post<PatientInfo>(`${this.baseUrl}/public`, patient, { headers }).toPromise();
        }
    }

    update(patient: PatientInfo): Promise<PatientInfo> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (patient) {
            return this.http.put<PatientInfo>(`${this.baseUrl}/${patient.id}`, patient, { headers }).toPromise();
        }
    }

    generateAppointmentsReport(id, request): Promise<DigitalDocument> {
        var headers = new HttpHeaders()
            .append('Content-Type', 'application/json');
        if (id && request) {
            return this.http.post<DigitalDocument>(`${this.baseUrl}/${id}/reports/appointments`, request, { headers }).toPromise();
        }
    }
}