import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Sticker } from "app/model/Sticker";
import { AppHttp } from "app/security/app-http";
import { environment } from "environments/environment";

@Injectable()
export class DashboardService {

    constructor(private http: AppHttp) {
    }

    getDashboardInfo(): Promise<Dashboard> {
        return this.http.get<Dashboard>(`${environment.apiUrl}/dashboard`).toPromise();
    }

    createSticker(request: Sticker): Promise<Sticker> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        return this.http.post<Sticker>(`${environment.apiUrl}/sticker`, request, { headers }).toPromise();
    }

    updateSticker(request: Sticker): Promise<Sticker> {
        var headers = new HttpHeaders()
            .append('Content-Type', "application/json");
        return this.http.put<Sticker>(`${environment.apiUrl}/sticker/${request.id}`, request, { headers }).toPromise();
    }

    deleteSticker(id: number): Promise<void> {
        return this.http.delete<void>(`${environment.apiUrl}/sticker/${id}`).toPromise();
    }
}

export class Dashboard {
    newPatients: Number = 0;
    medicalCareProvided: Number = 0;
    canceled: Number = 0;
    confirmed: Number = 0;
    appointments: any = [];
    totalActiveAttendance: Number = 0;
    totalAttendanceProvided: Number = 0;
    totalUnconfirmedAppointment: Number = 0;
    stickers: any = [];
}