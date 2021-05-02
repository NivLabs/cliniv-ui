import { Document } from "./Document";
import { Address } from "./Address";
import { Person } from "./Person";

/**
 * Informações detalhadas do usuário
 */
export class UserInfo extends Person {
    userName: string;
    email: string;
    password: string;
    roles: Array<any>;
}

/**
 * Filtros de pesquisa paginada para recuros usuários
 */
export class UserFilters {
    userName: string;
    cpf: string;
    fullName: string;
    socialName: string;
    gender: string;;
}