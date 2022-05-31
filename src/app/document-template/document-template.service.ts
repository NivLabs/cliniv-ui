import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentTemplateFilter, DocumentTemplateInfo } from 'app/model/DocumentTemplate';
import { Page, Pageable } from 'app/model/Util';
import { AppHttp } from 'app/security/app-http';
import { environment } from '../../environments/environment';

@Injectable()
export class DocumentTemplateService {

    resourceUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.resourceUrl = `${environment.apiUrl}/document-template`;
    }

    /**
     * Busca uma página de formulários
     * @param pageSettings Configurações de paginação
     */
     getPage(filters: DocumentTemplateFilter, pageSettings: Pageable): Promise<Page> {

        var queryString;
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
        return this.http.get<Page>(`${this.resourceUrl}?${queryString}`).toPromise();
    }

    /**
     * 
     * @param id Busca um modelo de documento por id
     */
    findById(id: number): Promise<DocumentTemplateInfo> {
        if (id) {
            return this.http.get<DocumentTemplateInfo>(`${this.resourceUrl}/${id}`).toPromise();
        }
    }

    create(request): Promise<DocumentTemplateInfo> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (request) {
            return this.http.post<DocumentTemplateInfo>(this.resourceUrl, request, { headers }).toPromise();
        }
    }

    update(request): Promise<DocumentTemplateInfo> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (request) {
            return this.http.put<DocumentTemplateInfo>(`${this.resourceUrl}/${request.id}`, request, { headers }).toPromise();
        }
    }

    delete(id): Promise<void> {
        if (id) {
            return this.http.delete<void>(`${this.resourceUrl}/${id}`).toPromise();
        }
    }

}