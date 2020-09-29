import { Injectable } from "@angular/core";
import { HealthPlan } from "app/model/HealthPlan";
import { AppHttp } from "app/security/app-http";
import { environment } from "environments/environment";

/**
 * Classe de serviços de Planos de Saúde para comunicação com a API 
 */
@Injectable()
export class HealthPlanService {
    baseUrl: string;

    constructor(private http: AppHttp) {
        this.baseUrl = `${environment.apiUrl}/health-operator/health-plan`;
    }

    /**
     * Busca informações do plano de saúde à partir do código interno único
     * 
     * @param id Identificador único interno do Plano de Saúde
     */
    getById(id): Promise<HealthPlan> {
        var headers = this.http.getHeadersDefault()
        if (id) {
            return this.http.get<HealthPlan>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }

    /**
     * Busca informações do plano de saúde à partir do Código da ANS
     * 
     * @param ansCode Código ANS
     */
    getByAnsCode(ansCode): Promise<HealthPlan> {
        var headers = this.http.getHeadersDefault()
        if (ansCode) {
            return this.http.get<HealthPlan>(`${this.baseUrl}/ansCode/${ansCode}`, { headers }).toPromise();
        }
    }

    create(request: HealthPlan): Promise<HealthPlan> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (request) {
            return this.http.post<HealthPlan>(`${this.baseUrl}`, request, { headers }).toPromise();
        }
    }

    update(request: HealthPlan): Promise<HealthPlan> {
        var headers = this.http.getHeadersDefault()
            .append('Content-Type', "application/json");
        if (request) {
            return this.http.put<HealthPlan>(`${this.baseUrl}/${request.id}`, request, { headers }).toPromise();
        }
    }

    delete(id: number): Promise<void> {
        var headers = this.http.getHeadersDefault();

        if (id) {
            return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers }).toPromise();
        }
    }
}