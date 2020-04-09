import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { UserInfo } from 'app/model/User';
import { Page } from 'app/model/Util';

@Injectable()
export class AdminService {
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

    getPage(filter): Promise<Page> {
        var headers = this.http.getHeadersDefault();
        if (!filter) {
            return this.http.get<Page>(this.baseUrl, { headers }).toPromise();
        }
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