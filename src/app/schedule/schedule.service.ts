import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Schedule, ScheduleFilter, ScheduleInfo } from "app/model/Schedule";
import { AppHttp } from "app/security/app-http";
import { environment } from '../../environments/environment';

@Injectable()
export class ScheduleService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/schedule`;
    }

    /**
     * Busca informações detalhadas de um agendamento
     * @param id Idenditicador único do agendamento
     */
    findById(id: number): Promise<ScheduleInfo> {
        return this.http.get<ScheduleInfo>(`${this.baseUrl}/${id}`).toPromise();
    }

    /**
     * Cria ou atualiza as informações de um agendamento
     * @param request Requisição de Criação ou Atualização
     */
    createOrUpdate(request: ScheduleInfo): Promise<ScheduleInfo> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (request.id) {
            return this.http.put<ScheduleInfo>(`${this.baseUrl}/${request.id}`, request, { headers }).toPromise();
        } else {
            return this.http.post<ScheduleInfo>(`${this.baseUrl}`, request, { headers }).toPromise();
        }
    }


    /**
     * Busca as informações da agenda utilizando o filtro
     * @param scheduleFilter Filtro da Agenda
     */
    getByFilter(scheduleFilter: ScheduleFilter): Promise<Schedule[]> {
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

        return this.http.get<Schedule[]>(`${this.baseUrl}?${queryString}`).toPromise();
    }
}