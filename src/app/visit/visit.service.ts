import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';
import { Document } from 'app/patient/patient.service';

/**
 * Representa informações básicas da visita
 */
export class Visit {
    id: number;
    entryDatetime: Date;
    entryCause: string;
    isFinished: boolean;
}

export class NewVisit {
    patientId: number;
    eventTypeId: number;
    responsibleId: number;
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
 * Representa um profissional
 */
export class Responsible {
    id: number;
    firstName: string;
    lastName: string;
    professionalIdentity: string;
}

export class SpecializationInfo {
    id: number;
    description: string;
    responsibles: Array<Responsible>;
}

/**
 * Representa uma especialidade
 */
export class Specialization {
    id: number;
    name: string;
    description: string;
}

/**
 * Representa o tipo de entrada (Filho de VisitType)
 */
export class EntryType {
    id: number;
    name: string;
    description: string;
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

    resourceUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.resourceUrl = `${environment.apiUrl}/visit`;
        this.token = "Bearer " + localStorage.getItem('token');
    }

    initializeVisit(newVisit: Visit) {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);

        return this.http.post<VisitInfo>(`${this.resourceUrl}`, newVisit, { headers })
            .toPromise();
    }

    getActivedVisitByPatientId(patientId: number): Promise<VisitInfo> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);
        return this.http.get<VisitInfo>(`${this.resourceUrl}/actived/${patientId}/patient`, { headers })
            .toPromise();
    }

    getVisitById(visitId: number): Promise<VisitInfo> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);

        return this.http.get<VisitInfo>(`${this.resourceUrl}/${visitId}`, { headers })
            .toPromise();
    }

    getPatientHistory(patientId: number): Promise<Visit> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);
        return this.http.get<Visit>(`${this.resourceUrl}?patientId=${patientId}`, { headers })
            .toPromise();
    }
}