import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';
import { PatientHistory, VisitInfo, NewVisit } from 'app/model/Visit';



@Injectable()
export class VisitService {

    resourceUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.resourceUrl = `${environment.apiUrl}/visit`;
    }

    initializeVisit(newVisit: NewVisit) {
        var headers = this.http.getHeadersDefault();
        return this.http.post<VisitInfo>(`${this.resourceUrl}`, newVisit, { headers })
            .toPromise();
    }

    getActivedVisitByPatientId(patientId: number): Promise<VisitInfo> {
        var headers = this.http.getHeadersDefault();
        return this.http.get<VisitInfo>(`${this.resourceUrl}/actived/${patientId}/patient`, { headers })
            .toPromise();
    }

    getVisitById(visitId: number): Promise<VisitInfo> {
        var headers = this.http.getHeadersDefault();
        return this.http.get<VisitInfo>(`${this.resourceUrl}/${visitId}`, { headers })
            .toPromise();
    }

    getPatientHistory(patientId: number): Promise<PatientHistory> {
        var headers = this.http.getHeadersDefault();
        return this.http.get<PatientHistory>(`${this.resourceUrl}?patientId=${patientId}`, { headers })
            .toPromise();
    }
}