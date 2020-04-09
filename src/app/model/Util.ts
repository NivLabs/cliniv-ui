/**
 * Página para requisições paginadas
 */
export class Page {
    content: [];
    empty: boolean;
    first: boolean;
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
    pageNumber: number;
    pageSize: number;
    paged: boolean;
}
