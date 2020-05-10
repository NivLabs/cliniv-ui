/**
 * Classe que representa documentos digitais da aplicação
 */
export class DigitalDocument {
    constructor() {
        this.type = 'PDF';
        this.name = 'Nome do documento';
    }
    id: number;
    type: string; // PDF, JPEG, PNG, XML, JSON
    base64: string;
    name: string;
    createdAt: Date;
    visitId: number;
}