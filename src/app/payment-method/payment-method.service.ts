import { Injectable } from '@angular/core';
import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Page, Pageable } from 'app/model/Util';
import { PaymentMethod, PaymentMethodFilters } from 'app/model/PaymentMethod';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class PaymentMethodService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/payment-method`;
    }

    getPage(filter: PaymentMethodFilters, pageSettings: Pageable): Promise<Page> {
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

    create(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (paymentMethod) {
            return this.http.post<PaymentMethod>(`${this.baseUrl}`, paymentMethod, { headers }).toPromise();
        }
    }

    update(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        if (paymentMethod) {
            return this.http.put<PaymentMethod>(`${this.baseUrl}/${paymentMethod.id}`, paymentMethod, { headers }).toPromise();
        }
    }

}
