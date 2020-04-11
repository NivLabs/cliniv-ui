import { Document } from "./Document";
import { Address } from "./Address";
import { ProfessionalIdentity } from "./ProfessionalIdentity";

/**
 * Classe que representa um profissional da instituição
 */
export class Professional {
    id: number;
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    professionalIdentity?: ProfessionalIdentity = new ProfessionalIdentity('CRM');
    dispatcher: string;
    document?: Document = new Document('CPF');
    address?: Address = new Address();
    principalNumber: string;
    secondaryNumber: string;
    bornDate: Date;
    observations: string;
    gender: string;
    email: string;
    specializations: any;
}

/**
 * Filtro de pesquisa de profissionais 
 */
export class ProfessionalFilters {
    professionalIdentity: string;
    cpf: string;
    firstName: string;
    lastName: string;
}