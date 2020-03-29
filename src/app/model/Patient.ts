import { Document } from "./Document";
import { Address } from "./Address";

/**
 * Representa as informações detalhadas do paciente
 */
export class PatientInfo {
    id: number;
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    identity: string;
    dispatcher: string;
    document?: Document = new Document('CPF');
    address?: Address = new Address();
    principalNumber: string;
    secondaryNumber: string;
    bornDate: Date;
    observations: string;
    gender: string;
    email: string;
}

/**
 * Representa as informações resumidas do paciente
 */
export class Patient {
    id: number;
    firtName: string;
    lastName: string;
    bornDate: Date;
    gender: string;
    cpf: string;
    principalNumber: string;
}