/**
 * Status de um Lote TISS
 */
export const tissBatchStatuses = [
    { value: 'DRAFT', label: 'Rascunho' },
    { value: 'SUBMITTED', label: 'Enviado' },
    { value: 'APPROVED', label: 'Aprovado' },
    { value: 'PARTIAL_GLOSA', label: 'Glosa Parcial' },
    { value: 'GLOSA_TOTAL', label: 'Glosa Total' },
    { value: 'REPASSED', label: 'Repassado' }
];

/**
 * Lote TISS - Faturamento por Convênio
 * Agrupa lançamentos financeiros de uma operadora em um período
 */
export class TissBatch {
    id: number;
    healthOperatorId: number;
    healthOperatorName: string;
    referenceMonth: number;
    referenceYear: number;
    status: string = 'DRAFT';
    totalGross: number = 0;
    totalGlosa: number = 0;
    totalNet: number = 0;
    observations: string;
}

/**
 * Filtros de Lote TISS
 */
export class TissBatchFilters {
    healthOperatorId: number;
    referenceMonth: number;
    referenceYear: number;
    status: string;
    page: number = 0;
    size: number = 20;
}
