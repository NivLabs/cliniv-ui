import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';
import { NumberSymbol } from '@angular/common';
import { Document } from 'app/patient/patient.service';

/**
 * Representa informações básicas da visita
 */
export class Visit {
    id: number;
    entryDatetime: Date;
    entryCause: string;
}

/**
 * Representa informações detalhadas da visita
 */
export class VisitInfo {
    id: number;
    patientId: number;
    document: Document;
    firstName: string;
    lastName: string;
    principalNumber: string;
    bornDate: Date;
    gender: string;
    allergies: Array<string>;
    events: Array<VisitEvent>;
    evolutions: Array<Evolution>;
    medicines: Array<Medicine>;
}

/**
 * Representa um item da evolução
 */
export class Evolution {
    id: number;
    datetime: Date;
}

export class Medicine {
    id: number;
    datetime: Date;
    description: string;
    amount: string;
    prescriptionOfficer: string;
    responsibleForTheAdministration: string;
}
/**
 * Representa o evento da visita
 */
export class VisitEvent {
    id: number;
    datetime: Date;
    description: string;
    documentId: number;
}


@Injectable()
export class VisitService {

    profileUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.profileUrl = `${environment.apiUrl}/visit`;
        this.token = "Bearer " + localStorage.getItem('token');
    }

    getVisitsByPatientId(patientId: number): Promise<Visit> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);
        return this.http.get<Visit>(`${this.profileUrl}/${patientId}/patient`, { headers })
            .toPromise();
    }

    getVisitById(visitId: number): Promise<VisitInfo> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);

        return this.http.get<VisitInfo>(`${this.profileUrl}/${visitId}`, { headers })
            .toPromise();
    }
}