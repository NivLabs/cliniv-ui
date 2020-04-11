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

export class PatientFilters {
    id: number;
    firstName: string;
    lastName: string;
    cpf: string;
}