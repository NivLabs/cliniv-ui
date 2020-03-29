import { MedicationUsed } from "./Medicine";
import { Evolution } from "./Evolution";
import { Document } from "./Document";

/**
 * Representa informações detalhadas do atendimento
 */
export class VisitInfo {
    id: number;
    patientId: number;
    document: Document;
    firstName: string;
    lastName: string;
    principalNumber: string;
    bornDate: Date;
    gender: string;
    allergies: Array<string>;
    events: Array<VisitEvent>;
    evolutions: Array<Evolution>;
    medicines: Array<MedicationUsed>;
}

/**
 * Representa o evento da visita
 */
export class VisitEvent {
    id: number;
    datetime: Date;
    description: string;
    documentId: number;
}

/**
 * Representa o objeto de criação de visita
 */
export class NewVisit {
    patientId: number;
    eventTypeId: number;
    responsibleId: number;
    entryCause: string;
}

/**
 * Classe que representa o histórico de visitas do Paciente
 */
export class PatientHistory {
    id: number;
    entryDatetime: Date;
    entryCause: string;
    isFinished: boolean;
}