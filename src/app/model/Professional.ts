import { ProfessionalIdentity } from "./ProfessionalIdentity";
import { Person } from "./Person";

/**
 * Classe que representa um profissional da instituição
 */
export class Professional extends Person {
    professionalIdentity?: ProfessionalIdentity = new ProfessionalIdentity();
    specializations: any;
}

/**
 * Filtro de pesquisa de profissionais 
 */
export class ProfessionalFilters {
    id: number;
    professionalIdentity: string;
    cpf: string;
    fullName: string;
    socialName: string;
}