import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';
import { PatientHistory, MedicalRecord, NewAttendance, CloseAttendanceRequest, NewAttendanceEvent } from 'app/model/Attendance';
import { Page, Pageable } from 'app/model/Util';
import { DynamicFormAnswered } from 'app/model/DynamicFormAnswered';
import { Allergy, AllergyFilters } from 'app/model/Allergy';
import { EvolutionInfo } from 'app/model/Evolution';
import { HttpHeaders } from '@angular/common/http';
import { Prescription } from 'app/model/Prescription';

@Injectable()
export class MedicalRecordService {

    resourceUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.resourceUrl = `${environment.apiUrl}/attendance`;
    }

    initializeVisit(dataToForm: NewAttendance) {
        return this.http.post<MedicalRecord>(`${this.resourceUrl}`, dataToForm)
            .toPromise();
    }

    getActivedVisitByPatientId(patientId: number): Promise<MedicalRecord> {
        return this.http.get<MedicalRecord>(`${this.resourceUrl}/actived/${patientId}/patient`)
            .toPromise();
    }

    getVisitById(attendanceId: number): Promise<MedicalRecord> {
        return this.http.get<MedicalRecord>(`${this.resourceUrl}/${attendanceId}`)
            .toPromise();
    }

    getPatientHistory(patientId: number): Promise<PatientHistory> {
        return this.http.get<PatientHistory>(`${this.resourceUrl}/history/${patientId}/patient`)
            .toPromise();
    }

    createDyanmicFormResponse(dynamicFormResponse, attendanceId): Promise<DynamicFormAnswered> {
        if (dynamicFormResponse) {
            return this.http.post<DynamicFormAnswered>(`${this.resourceUrl}/${attendanceId}/dynamic-form`, dynamicFormResponse).toPromise();
        }
    }

    getPageAllergies(filter: AllergyFilters, pageSettings: Pageable): Promise<Page> {
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
        return this.http.get<Page>(`${environment.apiUrl}/allergy?${queryString}`).toPromise();
    }

    saveAllergies(descriptions, patientId): Promise<any> {
        if (descriptions) {
            return this.http.post<Allergy>(`${environment.apiUrl}/allergy/patient/${patientId}`, descriptions).toPromise();
        }
    }

    saveEvolution(evolution): Promise<any> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");

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
        var headers = new HttpHeaders().append('Content-Type', "application/json");

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
        var headers = new HttpHeaders().append('Content-Type', "application/json");

        if (request) {
            return this.http.post<void>(`${this.resourceUrl}/event`, request, { headers }).toPromise();
        }
    }

    /**
     * Realiza a criação de uma prescrição médica em um atendimento ativo
     * 
     * @param request Requisição de criação de prescrição
     */
    createPrescription(request: Prescription): Promise<void> {
        var headers = new HttpHeaders().append('Content-Type', "application/json");

        if (request) {
            return this.http.post<void>(`${this.resourceUrl}/prescription`, request, { headers }).toPromise();
        }
    }
}