import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from 'environments/environment';
import { Address } from 'app/model/Address';

@Injectable()
export class AddressService {

    resourceUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.resourceUrl = `${environment.apiUrl}/cep`;
    }

    getAddressByCep(cep: string): Promise<Address> {
        var headers = this.http.getHeadersDefault();
        return this.http.get<Address>(`${this.resourceUrl}/${cep}`, { headers })
            .toPromise();
    }
}
