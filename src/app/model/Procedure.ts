/**
 * Classe que representa as informações de um procedimento
 */
export class ProcedureInfo {
    id: number;
    description: string;
    active: boolean;
    previousAudit: boolean;
    specialAuthorization: boolean;
    specialty: boolean;
    maxAge: string;
    minAge: string;
    frequency: string;
}

/**
 * Filtros de procedimentos
 */
export class ProcedureFilters {
    id: string;
    description: string;
    activeType: string;
}