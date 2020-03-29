/**
 * Representa o uso de um medicamento
 */
export class MedicationUsed {
    id: number;
    datetime: Date;
    description: string;
    amount: string;
    prescriptionOfficer: string;
    responsibleForTheAdministration: string;
}