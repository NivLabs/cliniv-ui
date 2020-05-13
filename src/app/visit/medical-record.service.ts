import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';
import { PatientHistory, MedicalRecord, NewAttendance } from 'app/model/Attendance';



@Injectable()
export class MedicalRecordService {

    resourceUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.resourceUrl = `${environment.apiUrl}/attendance`;
    }

    initializeVisit(newVisit: NewAttendance) {
        var headers = this.http.getHeadersDefault();
        return this.http.post<MedicalRecord>(`${this.resourceUrl}`, newVisit, { headers })
            .toPromise();
    }

    getActivedVisitByPatientId(patientId: number): Promise<MedicalRecord> {
        var headers = this.http.getHeadersDefault();
        return this.http.get<MedicalRecord>(`${this.resourceUrl}/actived/${patientId}/patient`, { headers })
            .toPromise();
    }

    getVisitById(visitId: number): Promise<MedicalRecord> {
        var headers = this.http.getHeadersDefault();
        return this.http.get<MedicalRecord>(`${this.resourceUrl}/${visitId}`, { headers })
            .toPromise();
    }

    getPatientHistory(patientId: number): Promise<PatientHistory> {
        var headers = this.http.getHeadersDefault();
        return this.http.get<PatientHistory>(`${this.resourceUrl}/history/${patientId}/patient`, { headers })
            .toPromise();
    }
}