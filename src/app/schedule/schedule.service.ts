import { Injectable } from "@angular/core";
import { ScheduleFilter, ScheduleInfo } from "app/model/Schedule";
import { AppHttp } from "app/security/app-http";
import { environment } from '../../environments/environment';

@Injectable()
export class ScheduleService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/schedule`;
    }

    /**
     * Busca as informações da agenda utilizando o filtro
     * @param scheduleFilter Filtro da Agenda
     */
    getByFilter(scheduleFilter: ScheduleFilter): Promise<ScheduleInfo[]> {
        var headers = this.http.getHeadersDefault();
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

        return this.http.get<ScheduleInfo[]>(`${this.baseUrl}?${queryString}`, { headers }).toPromise();


    }
}