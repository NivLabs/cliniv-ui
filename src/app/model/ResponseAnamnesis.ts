import { Response } from "./Response";

/**
 * Classe que representa as respostas referente a anamnese de um atendimento
 */
export class ResponseAnamnesis {   
    constructor() { 
        this.attendanceId = 0;
        this.listOfResponse = new Array<Response>();
    }
    roomOrBedId:number;
    attendanceId: number; 
    listOfResponse: Array<Response>;
}
