/**
 * Classe que representa uma sala (ambulatório) ou leito 
 */
export class Accommodation {
    id: number;
    sectorId: number;
    description: string = "Nenhum";
    type: string = "ROOM";
}