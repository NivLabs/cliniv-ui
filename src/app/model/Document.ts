/**
 * Classe que representa documentos para Pessoa (Física ou Jurídica)
 */
export class Document {
    constructor(type) {
        this.type = type;
    }
    type: string; // CPF, CNPJ, PASSAPORTE, RNE
    value: string; // Valor do documento
}