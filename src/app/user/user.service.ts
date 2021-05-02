import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { UserInfo, UserFilters } from 'app/model/User';
import { Page, Pageable } from 'app/model/Util';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/user`;
    }

    getById(id): Promise<UserInfo> {
        if (id) {
            return this.http.get<UserInfo>(`${this.baseUrl}/${id}`).toPromise();
        }
    }

    getPage(filter: UserFilters, pageSettings: Pageable): Promise<Page> {
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
        return this.http.get<Page>(`${this.baseUrl}?${queryString}`).toPromise();
    }


    getByCpf(cpf: string): Promise<UserInfo> {
        if (cpf) {
            return this.http.get<UserInfo>(`${this.baseUrl}/CPF/${cpf}`).toPromise();
        }
    }

    create(user: UserInfo): Promise<UserInfo> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (user) {
            return this.http.post<UserInfo>(`${this.baseUrl}`, user, { headers }).toPromise();
        }
    }

    update(user: UserInfo): Promise<UserInfo> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (user) {
            return this.http.put<UserInfo>(`${this.baseUrl}/${user.id}`, user, { headers }).toPromise();
        }
    }

    resertPassword(id: number): Promise<void> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (id) {
            return this.http.put<void>(`${this.baseUrl}/${id}/reset-password`, {}, { headers }).toPromise();
        }
    }
}