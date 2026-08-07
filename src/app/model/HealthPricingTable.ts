/**
 * Tabela de Preço de Operadora
 * Preço negociado por operadora e procedimento
 */
export class HealthPricingTable {
    id: number;
    healthOperatorId: number;
    healthOperatorName: string;
    procedureId: number;
    procedureDescription: string;
    negotiatedValue: number = 0;
}

/**
 * Filtros de Tabela de Preço
 */
export class HealthPricingTableFilters {
    healthOperatorId: number;
    procedureId: number;
    page: number = 0;
    size: number = 20;
}
