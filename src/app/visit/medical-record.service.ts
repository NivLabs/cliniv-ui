import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';
import { PatientHistory, MedicalRecord, NewAttendance } from 'app/model/Attendance';
import { AnamnesisItem } from 'app/model/AnamnesisItem';
import { Page, Pageable } from 'app/model/Util';
import { ResponseAnamnesis } from 'app/model/ResponseAnamnesis';

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

    getPageOfQuestions(pageSettings: Pageable): Promise<Page> {
        var headers = this.http.getHeadersDefault();
        var queryString;        
        if (pageSettings) {
            let params = new URLSearchParams();
            for (let key in pageSettings) {
                params.set(key, pageSettings[key])
            }
            queryString = queryString ? queryString + '&' + params.toString() : params.toString();

        }
        return this.http.get<Page>(`${this.resourceUrl}/anamnese-item?${queryString}`, { headers }).toPromise();
    }

    createAnamnesis(responseAnamnesis): Promise<ResponseAnamnesis> {
        var headers = this.http.getHeadersDefault();

        if (responseAnamnesis) {
            return this.http.post<ResponseAnamnesis>(`${this.resourceUrl}/anamnesis`, responseAnamnesis, { headers }).toPromise();
        }
    }
}