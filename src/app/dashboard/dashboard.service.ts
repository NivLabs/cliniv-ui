import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { AppHttp } from "app/security/app-http";

@Injectable()
export class DashboardService {

    constructor(private http: AppHttp) {
    }

    getDashboardInfo(): Promise<Dashboard> {
        var headers = this.http.getHeadersDefault();

        return this.http.get<Dashboard>(`${environment.apiUrl}/dashboard`, { headers })
            .toPromise();
    }
}

export class Dashboard {
    
}