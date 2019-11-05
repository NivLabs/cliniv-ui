import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';


export class AddressFromAPI {
    constructor() { }
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    unidade: string;
    ibge: string;
    gia: string;
}


@Injectable()
export class AddressService {

    baseUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `https://viacep.com.br/ws`;
        this.token = "Bearer " + localStorage.getItem('token');
    }

    getAddressByCep(cep: string): Promise<AddressFromAPI> {
        return this.http.get<AddressFromAPI>(`${this.baseUrl}/${cep}/json`, { })
            .toPromise();
    }
}
