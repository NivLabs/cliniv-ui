/**
 * Classe que representa as informações de um procedimento
 */
export class ProcedureInfo {
    id: number;
    description: string = "";
    active: boolean = true;
    previousAudit: boolean = true;
    specialAuthorization: boolean = false;
    specialty: boolean = false;
    maxAge: string = "Não definida";
    minAge: string = "Não definida";
    frequency: string = "Não definida";
}

/**
 * Filtros de procedimentos
 */
export class ProcedureFilters {
    id: string;
    description: string;
    activeType: string;
}