import { Accommodation } from "./Accommodation";

/**
 * Classe que representa um setor
 */
export class Sector {
    id: number;
    description: string;
    listOfRoomsOrBeds: Array<Accommodation>;
}

/**
 * Filtros de setor
 */
export class SectorFilters {
    id: string;
    description: string;
}