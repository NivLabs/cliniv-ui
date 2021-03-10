import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { AppHttp } from "app/security/app-http";

@Injectable()
export class DashboardService {

    constructor(private http: AppHttp) {
    }

    getDashboardInfo(): Promise<Dashboard> {
        return this.http.get<Dashboard>(`${environment.apiUrl}/dashboard`).toPromise();
    }
}

export class Dashboard {
    newPatients: Number = 0;
    medicalCareProvided: Number = 0;
    canceled: Number = 0;
    confirmed: Number = 0;
}