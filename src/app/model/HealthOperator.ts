import { Document } from "./Document";
import { HealthPlan } from "./HealthPlan";

export class HealthOperator {
    id: number;
    ansCode: string;
    document?: Document = new Document('CNOJ');
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