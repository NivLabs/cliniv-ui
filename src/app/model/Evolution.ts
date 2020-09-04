/**
 * Representa um item da evolução
 */
export class Evolution {
    id: number;
    datetime: Date;
}

export class EvolutionInfo {
    id: number;
    attendanceId: number;
    accomodationId: number;
    description: string = "";
    datetime: Date;
    responsibleName: string;
}