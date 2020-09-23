import { HealthPlan } from "./HealthPlan";

export class HealthOperator {
    id: string;
    ansCode: string;
    cnpj: string;
    companyName: string;
    fantasyName: string;
    modality: string;
    healthPlans: Array<HealthPlan>;
}

export class HealthOperatorFilter {
    id: string;
    ansCode: string;
    cnpj: string;
    companyName: string;
    fantasyName: string;
    modality: string;
}