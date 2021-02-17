import { ReportParameters } from "./ReportParameters";

/**
 * Classe que representa um relatório
 */
export class Report {
    id: number;
    name: string;
    base64: string;
    type: string;
    params: Array<ReportParameters>
    
    constructor() {
        this.type = 'XML';
    }
}

/**
 * Filtros de relatório
 */
export class ReportFilters {
    id: string;
    name: string;
}