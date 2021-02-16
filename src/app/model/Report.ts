/**
 * Classe que representa um relatório
 */
export class Report {
    id: number;
    name: string;
    base64: string;
}

/**
 * Filtros de relatório
 */
export class ReportFilters {
    id: string;
    name: string;
}