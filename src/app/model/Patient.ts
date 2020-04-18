import { Document } from "./Document";
import { Address } from "./Address";
import { Person } from "./Person";

/**
 * Representa as informações detalhadas do paciente
 */
export class PatientInfo extends Person {
}

export class PatientFilters {
    id: number;
    firstName: string;
    lastName: string;
    cpf: string;
}