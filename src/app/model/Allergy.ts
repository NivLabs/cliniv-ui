/**
 * Classe que representa uma alergia
 */
export class Allergy {
    id: number;
    description: string;
}

/**
 * Filtros de alergia
 */
export class AllergyFilters {
    description: string;
}

/**
 * Classe que representa as alergias do paciente
 */
export class AllergiesDescriptions {
    descriptions: Array<string>;

    constructor() { 
        this.descriptions = new Array<string>();
    }
}