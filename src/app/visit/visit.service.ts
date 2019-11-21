import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { AppHttp } from '../security/app-http';
import { NumberSymbol } from '@angular/common';

export class Visit {
    id: number;
    entryDatetime: Date;
    entryCause: string;
}


@Injectable()
export class VisitService {

    profileUrl: string;
    token: string;

    constructor(private http: AppHttp) {
        this.profileUrl = `${environment.apiUrl}/visit`;
        this.token = "Bearer " + localStorage.getItem('token');
    }

    getVisitsByPatientId(patientId: number): Promise<Visit> {
        var headers = new HttpHeaders()
            .append('Authorization', this.token);
        return this.http.get<Visit>(`${this.profileUrl}`, { headers })
            .toPromise();
    }
}