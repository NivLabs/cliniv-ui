/**
 * Página para requisições paginadas
 */
export class Page {
    content: [];
    empty: boolean = true;
    first: boolean = true;
    last: boolean = true;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number = 0;
    totalElements: number = 0;
    totalPages: number = 0;
}

/**
 * Filtro de paginação
 */
export class Pageable {
    page: number = 0;
    size: number = 24;
}
