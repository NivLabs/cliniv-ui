import { License } from "./License";
import { Address } from "./Address";

/**
 * Classe que representa o cliente
 */
export class Customer {
    id: number;
    name: string;
    managerName: string;
    managerMail: string;
    managerPhone: string;
    phone: string;
    cnes: number;
    cgcType: string = 'CPF';
    cgc: number;
    corporativeName: string;
    dependency: string;
    legalNature: string;
    instituteType: string;
    license?: License = new License();
    address?: Address = new Address();
    logoBase64: string;
}