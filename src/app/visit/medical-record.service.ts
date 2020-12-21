import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';
import { PatientHistory, MedicalRecord, NewAttendance, CloseAttendanceRequest, NewAttendanceEvent } from 'app/model/Attendance';
import { Page, Pageable } from 'app/model/Util';
import { ResponseAnamnesis } from 'app/model/ResponseAnamnesis';
import { Allergy, AllergyFilters } from 'app/model/Allergy';
import { EvolutionInfo } from 'app/model/Evolution';

@Injectable()
export class MedicalRecordService {

    resourceUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.resourceUrl = `${environment.apiUrl}/attendance`;
    }

    initializeVisit(dataToForm: NewAttendance) {
        var headers = this.http.getHeadersDefault();
        return this.http.post<MedicalRecord>(`${this.resourceUrl}`, dataToForm, { headers })
            .toPromise();
    }

    getActivedVisitByPatientId(patientId: number): Promise<MedicalRecord> {
        var headers = this.http.getHeadersDefault();
        return this.http.get<MedicalRecord>(`${this.resourceUrl}/actived/${patientId}/patient`, { headers })
            .toPromise();
    }

    getVisitById(attendanceId: number): Promise<MedicalRecord> {
        var headers = this.http.getHeadersDefault();
        return this.http.get<MedicalRecord>(`${this.resourceUrl}/${attendanceId}`, { headers })
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

    getPageAllergies(filter: AllergyFilters, pageSettings: Pageable): Promise<Page> {
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
        return this.http.get<Page>(`${environment.apiUrl}/allergy?${queryString}`, { headers }).toPromise();
    }

    saveAllergies(descriptions, patientId): Promise<any> {
        var headers = this.http.getHeadersDefault();

        if (descriptions) {
            return this.http.post<Allergy>(`${environment.apiUrl}/allergy/patient/${patientId}`, descriptions, { headers }).toPromise();
        }
    }

    saveEvolution(evolution): Promise<any> {
        var headers = this.http.getHeadersDefault().append('Content-Type', "application/json");

        if (evolution) {
            return this.http.post<EvolutionInfo>(`${this.resourceUrl}/evolution`, evolution, { headers }).toPromise();
        }
    }

    /**
     * Requisição de encerramento de atendimento (Alta)
     * 
     * @param attendanceId Identificador únio do Atendimento
     * @param request Requisição de alta
     */
    closeAttendance(attendanceId: number, request: CloseAttendanceRequest): Promise<void> {
        var headers = this.http.getHeadersDefault().append('Content-Type', "application/json");

        if (request) {
            return this.http.put<void>(`${this.resourceUrl}/${attendanceId}`, request, { headers }).toPromise();
        }
    }

    /**
     * Realiza a requisição de criação de evento de atendimento (Prontuário)
     * 
     * @param request Requisição de criação de evento de atendimento (Prontuário)
     */
    createAttendanceEvent(request: NewAttendanceEvent): Promise<void> {
        var headers = this.http.getHeadersDefault().append('Content-Type', "application/json");

        if (request) {
            return this.http.post<void>(`${this.resourceUrl}/event`, request, { headers }).toPromise();
        }
    }
}