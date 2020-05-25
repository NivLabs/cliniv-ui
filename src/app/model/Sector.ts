/**
 * Classe que representa um setor
 */
export class Sector {

    id: number;
    description: string;
    createdAt: Date;

    constructor(id: number, description: string, createdAt: Date) {
        this.id = id;
        this.description = description;
        this.createdAt = createdAt;
    }
}

/**
 * Filtros de setor
 */
export class SectorFilters {
    id: string;
    description: string;
}