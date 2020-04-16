import { Document } from "./Document";
import { Address } from "./Address";

/**
 * Informações detalhadas do usuário
 */
export class UserInfo {
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
    roles: Array<any>;
}

/**
 * Filtros de pesquisa paginada para recuros usuários
 */
export class UserFilters {
    userName: string;
    cpf: string;
    firstName: string;
    lastName: string;
    gender: string;;
}