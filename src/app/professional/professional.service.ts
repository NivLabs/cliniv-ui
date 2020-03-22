import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { Page } from 'app/core/util.service';

export class Address {
    constructor() { }
    street: string = null;
    city: string = null;
    state: string = null;
    postalCode: string = null;
    addressNumber: string = null;
    complement: string = null;
    neighborhood: string = null;
}

export class Document {
    constructor(type) {
        this.type = type;
    }
    type: string; // CPF, CNPJ, PASSAPORTE, RNE
    value: string; // Valor do documento
}

export class Professional {
  id: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  professionalIdentity?: ProfessionalIdentity = new ProfessionalIdentity('CRM');
  dispatcher: string;
  document?: Document = new Document('CPF');
  address?: Address = new Address();
  principalNumber: string;
  secondaryNumber: string;
  bornDate: Date;
  observations: string;
  gender: string;
  email: string;
  specializations: any;
}

export class ProfessionalIdentity {
  constructor(registerType) {
    this.registerType = registerType;
  }
  registerType: string; // CRM, COREN, CRO, CRP
  registerValue: string; // Valor do documento
}


@Injectable()
export class ProfessionalService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/responsible`;
    }

    getById(id): Promise<Professional> {    
        var headers = this.http.getHeadersDefault();
        if (id) {
            return this.http.get<Professional>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }

    getPageOfProfessionals(filter): Promise<Page> {
        var headers = this.http.getHeadersDefault();
        if (!filter) {
            return this.http.get<Page>(this.baseUrl, { headers }).toPromise();
        }
    }


    getByCpf(cpf: string): Promise<Professional> {
        var headers = this.http.getHeadersDefault();
        if (cpf) {
            return this.http.get<Professional>(`${this.baseUrl}/CPF/${cpf}`, { headers }).toPromise();
        }
    }

    create(professional: Professional): Promise<Professional> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (professional) {
            return this.http.post<Professional>(`${this.baseUrl}`, professional, { headers }).toPromise();
        }
    }

    update(professional: Professional): Promise<Professional> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (professional) {
            return this.http.put<Professional>(`${this.baseUrl}/${professional.id}`, professional, { headers }).toPromise();
        }
    }
}