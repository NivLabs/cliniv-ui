import { Document } from "./Document";
import { Address } from "./Address";
import { ProfessionalIdentity } from "./ProfessionalIdentity";
import { Person } from "./Person";

/**
 * Classe que representa um profissional da instituição
 */
export class Professional extends Person {
    professionalIdentity?: ProfessionalIdentity = new ProfessionalIdentity('CRM');
    specializations: any;
}

/**
 * Filtro de pesquisa de profissionais 
 */
export class ProfessionalFilters {
    id: number;
    professionalIdentity: string;
    cpf: string;
    firstName: string;
    lastName: string;
}