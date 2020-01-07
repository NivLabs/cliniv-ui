import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { environment } from "environments/environment";
import { AppHttp } from "app/security/app-http";
import { Specialization } from "app/visit/visit.service";


export class EventType {
    id: number;
    superEventType: EventType;
    name: string;
    description: string;
}

@Injectable()
export class UtilService {

    token: string;
    private eventTypes: Array<EventType>;

    constructor(private http: AppHttp) {
        this.token = "Bearer " + localStorage.getItem('token');
    }

    getEventTypes(): Promise<Array<EventType>> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);

        return this.http.get<Array<EventType>>(`${environment.apiUrl}/event-type`, { headers })
            .toPromise();
    }

    getSpecialization(): Promise<Array<Specialization>> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);

        return this.http.get<Array<Specialization>>(`${environment.apiUrl}/speciality`, { headers })
            .toPromise();
    }

    cpfIsValid(strCPF) {
        var sum;
        var mod;
        sum = 0;
        if (strCPF == "00000000000") return false;

        for (var i = 1; i <= 9; i++) {
            sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        }
        mod = (sum * 10) % 11;

        if ((mod == 10) || (mod == 11)) mod = 0;
        if (mod != parseInt(strCPF.substring(9, 10))) return false;

        sum = 0;
        for (i = 1; i <= 10; i++) sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        mod = (sum * 10) % 11;

        if ((mod == 10) || (mod == 11)) mod = 0;
        if (mod != parseInt(strCPF.substring(10, 11))) return false;
        return true;
    }
}