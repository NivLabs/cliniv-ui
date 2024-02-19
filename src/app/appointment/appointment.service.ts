import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GetAppointmentResponse, Appointment, AppointmentFilter, AppointmentInfo } from "app/model/Appointment";
import { AppHttp } from "app/security/app-http";
import { environment } from '../../environments/environment';

@Injectable()
export class AppointmentService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/appointment`;
    }

    /**
     * Busca informações detalhadas de um agendamento
     * @param id Idenditicador único do agendamento
     */
    findById(id: number): Promise<AppointmentInfo> {
        return this.http.get<AppointmentInfo>(`${this.baseUrl}/${id}`).toPromise();
    }

    /**
     * Cria ou atualiza as informações de um agendamento
     * @param request Requisição de Criação ou Atualização
     */
    createOrUpdate(request: AppointmentInfo): Promise<AppointmentInfo> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (request.id) {
            return this.http.put<AppointmentInfo>(`${this.baseUrl}/${request.id}`, request, { headers }).toPromise();
        } else {
            return this.http.post<AppointmentInfo>(`${this.baseUrl}`, request, { headers }).toPromise();
        }
    }


    /**
     * Busca as informações da agenda utilizando o filtro
     * @param scheduleFilter Filtro da Agenda
     */
    getByFilter(scheduleFilter: AppointmentFilter): Promise<GetAppointmentResponse> {
        var queryString;
        if (scheduleFilter) {
            let params = new URLSearchParams();
            for (let key in scheduleFilter) {
                if (scheduleFilter[key]) {
                    params.set(key, scheduleFilter[key])
                }
            }
            queryString = params.toString();
        }

        return this.http.get<GetAppointmentResponse>(`${this.baseUrl}?${queryString}`).toPromise();
    }
    
    delete(id: number): Promise<void> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (id) {
            return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }
}