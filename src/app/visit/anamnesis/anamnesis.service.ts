import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppHttp } from '../../security/app-http';
import { Page, Pageable } from 'app/model/Util';
import { AnamnesisForm } from 'app/model/AnamnesisForm';

@Injectable()
export class AnamnesisService {

    resourceUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.resourceUrl = `${environment.apiUrl}/attendance/anamnesis`;
    }

    /**
     * Busca uma página de formulários de anamnese
     * @param pageSettings Configurações de paginação
     */
    getPageOfForms(pageSettings: Pageable): Promise<Page> {
        var headers = this.http.getHeadersDefault();
        var queryString;
        if (pageSettings) {
            let params = new URLSearchParams();
            for (let key in pageSettings) {
                params.set(key, pageSettings[key])
            }
            queryString = queryString ? queryString + '&' + params.toString() : params.toString();

        }
        return this.http.get<Page>(`${this.resourceUrl}/form?${queryString}`, { headers }).toPromise();
    }

    /**
     * 
     * @param id Busca um formulário de anamnese com as questões
     */
    findById(id: number): Promise<AnamnesisForm> {
        if (id) {
            var headers = this.http.getHeadersDefault();
            return this.http.get<AnamnesisForm>(`${this.resourceUrl}/form/${id}`, { headers }).toPromise();
        }
    }

}