/**
 * Glosa TISS - Contestação de Lançamento
 * Registro de glosa (contestação) sobre um lançamento financeiro em um lote TISS
 */
export class TissGlosa {
    id: number;
    tissBatchId: number;
    financialReleaseId: string;
    reason: string;
    contestedValue: number = 0;
    contestedPercentage: number = 0;
}

/**
 * Filtros de Glosa TISS
 */
export class TissGlosaFilters {
    tissBatchId: number;
    financialReleaseId: string;
    page: number = 0;
    size: number = 20;
}
