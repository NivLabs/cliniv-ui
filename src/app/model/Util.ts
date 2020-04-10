/**
 * Página para requisições paginadas
 */
export class Page {
    content: [];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number;
    totalElements: number;
    totalPages: number;
}

/**
 * Filtro de paginação
 */
export class Pageable {
    page: number = 0;
    size: number = 20;
}
