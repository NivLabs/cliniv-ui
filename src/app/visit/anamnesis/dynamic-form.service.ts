import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppHttp } from '../../security/app-http';
import { Page, Pageable } from 'app/model/Util';
import { DynamicForm, DynamicFormFilter } from 'app/model/AnamnesisForm';

@Injectable()
export class DynamicFormService {

    resourceUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.resourceUrl = `${environment.apiUrl}/anamnesis`;
    }

    /**
     * Busca uma página de formulários de anamnese
     * @param pageSettings Configurações de paginação
     */
    getPageOfForms(filters: DynamicFormFilter, pageSettings: Pageable): Promise<Page> {

        var queryString;
        var headers = this.http.getHeadersDefault();
        if (filters) {
            let params = new URLSearchParams();
            for (let key in filters) {
                if (filters[key]) {
                    params.set(key, filters[key])
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
        return this.http.get<Page>(`${this.resourceUrl}/form?${queryString}`, { headers }).toPromise();
    }

    /**
     * 
     * @param id Busca um formulário de anamnese com as questões
     */
    findById(id: number): Promise<DynamicForm> {
        if (id) {
            var headers = this.http.getHeadersDefault();
            return this.http.get<DynamicForm>(`${this.resourceUrl}/form/${id}`, { headers }).toPromise();
        }
    }

}