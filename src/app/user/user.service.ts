import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { UserInfo } from 'app/model/User';
import { Page, Pageable } from 'app/model/Util';

@Injectable()
export class UserService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/user`;
    }

    getById(id): Promise<UserInfo> {
        var headers = this.http.getHeadersDefault();
        if (id) {
            return this.http.get<UserInfo>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }

    getPage(filter, pageSettings: Pageable): Promise<Page> {
        var headers = this.http.getHeadersDefault();
        var queryString = ""
        if (filter) {
            let params = new URLSearchParams();
            for (let key in filter) {
                params.set(key, filter[key])
            }
            queryString = queryString + params.toString();
        }
        if (pageSettings) {
            let params = new URLSearchParams();
            for (let key in pageSettings) {
                params.set(key, pageSettings[key])
            }
            queryString = queryString + params.toString();

        }
        return this.http.get<Page>(`${this.baseUrl}?${queryString}`, { headers }).toPromise();
    }


    getByCpf(cpf: string): Promise<UserInfo> {
        var headers = this.http.getHeadersDefault();
        if (cpf) {
            return this.http.get<UserInfo>(`${this.baseUrl}/CPF/${cpf}`, { headers }).toPromise();
        }
    }

    create(user: UserInfo): Promise<UserInfo> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (user) {
            return this.http.post<UserInfo>(`${this.baseUrl}`, user, { headers }).toPromise();
        }
    }

    update(user: UserInfo): Promise<UserInfo> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (user) {
            return this.http.put<UserInfo>(`${this.baseUrl}/${user.id}`, user, { headers }).toPromise();
        }
    }
}