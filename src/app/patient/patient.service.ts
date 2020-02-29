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
export class Patient {
    id: number;
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    identity: string;
    dispatcher: string;
    document?: Document = new Document('CPF');
    address?: Address = new Address();
    principalNumber: string;
    secondaryNumber: string;
    bornDate: Date;
    observations: string;
    gender: string;
    email: string;
}


@Injectable()
export class PatientService {
    patientUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.patientUrl = `${environment.apiUrl}/patient`;
    }

    getById(id): Promise<Patient> {
        var headers = this.http.getHeadersDefault()
        if (id) {
            return this.http.get<Patient>(`${this.patientUrl}/${id}`, { headers }).toPromise();
        }
    }

    getPageOfPatients(filter): Promise<Page> {
        var headers = this.http.getHeadersDefault()
        if (!filter) {
            return this.http.get<Page>(this.patientUrl, { headers }).toPromise();
        }
    }


    getByCpf(cpf: string): Promise<Patient> {
        var headers = this.http.getHeadersDefault()
        if (cpf) {
            return this.http.get<Patient>(`${this.patientUrl}/CPF/${cpf}`, { headers }).toPromise();
        }
    }

    create(patient: Patient): Promise<Patient> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (patient) {
            return this.http.post<Patient>(`${this.patientUrl}`, patient, { headers }).toPromise();
        }
    }

    update(patient: Patient): Promise<Patient> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (patient) {
            return this.http.put<Patient>(`${this.patientUrl}/${patient.id}`, patient, { headers }).toPromise();
        }
    }
}