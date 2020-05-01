/**
 * Classe que representa um setor
 */
export class Sector {

    id: string;
    description: string;
    createdAt: Date;

    constructor(id: string, description: string, createdAt: Date) {
        this.id = id;
        this.description = description;
        this.createdAt = createdAt;
    }
}