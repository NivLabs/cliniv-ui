/**
 * Tipos de lançamento financeiro
 */
export const financialReleaseTypes = [
    { value: 'RECEIVABLE', label: 'A Receber' },
    { value: 'PAYABLE', label: 'A Pagar' }
];

/**
 * Situações do lançamento financeiro
 */
export const financialReleaseStatuses = [
    { value: 'PENDING', label: 'Aguardando' },
    { value: 'PAID', label: 'Pago' },
    { value: 'CANCELED', label: 'Cancelado' }
];

/**
 * Classe que representa um lançamento financeiro (conta a pagar ou a receber)
 */
export class FinancialRelease {
    id: string;
    title: string;
    categoryId: string;
    categoryDescription: string;
    patientId: number;
    patientName: string;
    paymentMethodId: number;
    paymentMethodName: string;
    grossValue: number = 0;
    netValue: number = 0;
    discountValue: number = 0;
    competenceDate: string;
    dueDate: string;
    paymentDateTime: string;
    type: string;
    status: string = 'PENDING';
    observation: string;
}

/**
 * Filtros de lançamento financeiro
 */
export class FinancialReleaseFilters {
    title: string;
    type: string;
    status: string;
    categoryId: string;
    patientId: number;
    dueDateFrom: string;
    dueDateTo: string;
}
