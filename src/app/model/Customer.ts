import { License } from "./License";
import { Address } from "./Address";

/**
 * Classe que representa o cliente
 */
export class Customer {
    id: number;
    name: string;
    management: string;
    phone: string;
    cnes: number;
    cnpj: number;
    corporativeName: string;
    dependency: string;
    legalNature: string;
    instituteType: string;
    license?: License = new License();
    address?: Address = new Address();
    logoBase64: string;
}