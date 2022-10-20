import { MedicationUsed } from "./Medicine";
import { Evolution } from "./Evolution";
import { Document } from "./Document";
import { Accommodation } from "./Accommodation";
import { EventType } from "./EventType";
import { ProcedureInfo } from "./Procedure";
import { Professional } from "./Professional";
import { FileInfo } from "./File";

/**
 * Informações do atendimento
 */
export class AttendanceInfo {
    id: number;
    type: string;
    fullName: string = "";
    socialName: string = "";
    patientId: number;
    cnsNumber: number;
    sectorId: number;
}

/**
 * Filtros de atendimento
 */
export class AttendanceFilters {
    sectorId: string;
    fullName: string;
    socialName: string;
    cpf: string;
    patientType: string;
    entryType: string;
    direction: string = 'DESC';
    orderBy: string = 'entryDateTime';
}

/**
 * Representa informações detalhadas do atendimento
 */
export class MedicalRecord {
    id: number;
    entryDateTime: Date;
    exitDateTime: Date;
    patientId: number;
    document: Document;
    cnsNumber: string;
    fullName: string;
    bloodType: string;
    socialName: string;
    principalNumber: string;
    lastAccommodation: Accommodation;
    bornDate: Date;
    gender: string;
    allergies: Array<string>;
    events: Array<AttendanceEvent>;
    evolutions: Array<Evolution>;
    medicines: Array<MedicationUsed>;
    attendanceLevel: string;
}

/**
 * Representa o evento do Atendimento
 */
export class AttendanceEvent {
    id: number;
    datetime: Date;
    description: string;
    documentId: number;
}

/**
 * Representa o objeto de criação de Atendimento
 */
export class NewAttendance {
    patientId: number;
    accommodationId: number;
    eventType: string;
    responsibleId: number;
    specialityId: number;
    entryCause: string;
    level: string;
}

/**
 * Classe que representa o histórico de atendimentos do Paciente
 */
export class PatientHistory {
    id: number;
    entryDatetime: Date;
    entryCause: string;
    isFinished: boolean;
}

/**
 * Classe que representa Objeto de requisição de alta médicaz
 */
export class CloseAttendanceRequest {
    eventType: string = "EXIT";
    observations: string;
}

/**
 * Classe que representa Objeto de requisição para criação de novo evento clínico
 */
export class NewAttendanceEvent {
    attendanceId: number;
    accommodation: Accommodation = new Accommodation();
    documents: Array<FileInfo> = [];
    eventType: string = "MEDICAL_CONTROL";
    observations: string;
    procedure: ProcedureInfo;
    responsible: Professional = new Professional();
}