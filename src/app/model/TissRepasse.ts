/**
 * Repasse TISS - Pagamento do Lote
 * Registro de pagamento/repasse de um lote TISS aprovado
 */
export class TissRepasse {
    id: number;
    tissBatchId: number;
    repaymentFinancialReleaseId: string;
    repaymentValue: number = 0;
    paymentDate: string;
    bankNumber: number;
    agencyNumber: string;
    accountNumber: string;
}

/**
 * Filtros de Repasse TISS
 */
export class TissRepasseFilters {
    tissBatchId: number;
    paymentDateFrom: string;
    paymentDateTo: string;
    page: number = 0;
    size: number = 20;
}
