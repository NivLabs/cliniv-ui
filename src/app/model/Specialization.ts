import { Professional } from "./Professional";

/**
 * Representa uma especialidade
 */
export class Specialization {
    id: number;
    name: string;
    description: string;
}


/**
 * Representa especialidade mais detalhada
 */
export class SpecializationInfo {
    id: number;
    description: string;
    responsibles: Array<Professional>;
}
