import { Injectable } from "@angular/core";
import { DigitalDocument } from "app/model/DigitalDocument";
import { EventType } from "app/model/EventType";
import { ParameterByGroup } from "app/model/Parameter";
import { SpecializationInfo } from "app/model/Specialization";
import { Page } from "app/model/Util";
import { AppHttp } from "app/security/app-http";
import { environment } from "environments/environment";

@Injectable()
export class UtilService {

    constructor(private http: AppHttp) {
    }

    getHost() {
        return '.nivlabs.com.br';
    }

    getLogo() {
        const unitsWithLogo = [
            'cliniv',
            'perseverar'
        ];
        return unitsWithLogo.find(item => item === localStorage.getItem('X-Customer-Id')) || 'cliniv';
    }

    getCustomerByHost() {
        let customerId = 'cliniv';
        if (window.location.host.endsWith(this.getHost())) {
            customerId = window.location.host.split('.')[0];
        }
        return customerId;
    }

    getEventTypes(): Promise<Array<EventType>> {
        return this.http.get<Array<EventType>>(`${environment.apiUrl}/event-type`)
            .toPromise();
    }

    getSpecialization(): Promise<Page> {
        return this.http.get<Page>(`${environment.apiUrl}/speciality?size=100`)
            .toPromise();
    }

    getSpecializationById(id: number): Promise<SpecializationInfo> {
        return this.http.get<SpecializationInfo>(`${environment.apiUrl}/speciality/${id}`)
            .toPromise();
    }

    getParametersByGroup(groupNane: string): Promise<ParameterByGroup> {
        return this.http.get<ParameterByGroup>(`${environment.apiUrl}/speciality/${groupNane}`).toPromise();
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

    getDigitalDocumentById(id: number): Promise<DigitalDocument> {
        return this.http.get<DigitalDocument>(`${environment.apiUrl}/digital-document/${id}`)
            .toPromise();
    }

    /**
     * Calcula a idade baseada na data de nascimento
     * @param bornDate Data de nascimento
     * @returns Idade
     */
    public calculateAge(bornDate: Date): number {
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        if (!(bornDate instanceof Date)) {
            bornDate = new Date(bornDate);
        }
        var bornDay = bornDate.getDay();
        var bornMonth = bornDate.getMonth();
        var bornYear = bornDate.getFullYear();
        var age = currentYear - bornYear;
        var currentMonth = currentDate.getMonth() + 1;
        //Se mes atual for menor que o nascimento, nao fez aniversario ainda;  
        if (currentMonth < bornMonth) {
            age--;
        } else {
            //Se estiver no mes do nascimento, verificar o dia
            if (currentMonth == bornMonth) {
                if (new Date().getDate() < bornDay) {
                    //Se a data atual for menor que o dia de nascimento ele ainda nao fez aniversario
                    age--;
                }
            }
        }
        return age;
    }
}