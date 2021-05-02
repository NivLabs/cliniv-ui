/**
 * Classe que representa as informações resumidas de um procedimento
 */
export class Procedure {
    id: number;
    description: string = "";
    baseValue: number = 0.0;
    frequency: string = "Não definida";
    specialAuthorization: boolean = false;
}

/**
 * Classe que representa as informações de um procedimento
 */
export class ProcedureInfo extends Procedure {
    specialty: boolean = false;
    previousAudit: boolean = true;
    maxAge: string = "Não definida";
    minAge: string = "Não definida";
}

/**
 * Filtros de procedimentos
 */
export class ProcedureFilters {
    id: string;
    description: string;
    activeType: string;
}