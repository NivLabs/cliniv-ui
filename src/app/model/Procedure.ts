/**
 * Classe que representa as informações de um procedimento
 */
export class ProcedureInfo {   
    id: number;
    description: string;
    active: boolean;
}

/**
 * Filtros de procedimentos
 */
export class ProcedureFilters {
    id: string;
    description: string;
    activeType: string;
}