/**
 * Classe que representa um Registro profissional
 */
export class ProfessionalIdentity {
    constructor(registerType) {
        this.registerType = registerType;
    }
    registerType: string; // CRM, COREN, CRO, CRP
    registerValue: string; // Valor do documento
}