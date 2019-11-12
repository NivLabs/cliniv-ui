import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppHttp } from '../security/app-http';
import { environment } from '../../environments/environment';
import { promise } from 'selenium-webdriver';

export class Pageable {
    pageNumber: number;
    pageSize: number;
    paged: boolean;
}
export class PatientPage {
    content: any;
    empty: boolean;
    first: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    totalElements: number;
    totalPages: number;
}



export class Address {
    constructor() { }
    street: string = null;
    city: string = null;
    state: string = null;
    postalCode: string = null;
    addressNumber: string = null;
    complement: string = null;
    district: string = null;
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
        this.token = "Bearer " + localStorage.getItem('token');
    }

    getPageOfPatients(filter): Promise<PatientPage> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);
        if (!filter) {
            return this.http.get<PatientPage>(this.patientUrl, { headers }).toPromise();
        }
    }


    getByCpf(cpf: string): Promise<Patient> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);
        if (cpf) {
            return this.http.get<Patient>(`${this.patientUrl}/CPF/${cpf}`, { headers }).toPromise();
        }
    }

    create(patient: Patient): Promise<Patient> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token)
            .append('Content-Type', "application/json");
        if (patient) {
            return this.http.post<Patient>(`${this.patientUrl}`, patient, { headers }).toPromise();
        }
    }
}