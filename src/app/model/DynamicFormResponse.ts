import { Response } from "./Response";

/**
 * Classe que representa as respostas referente ao formulário de um atendimento
 */
export class DynamicFormResponse {   
    constructor() { 
        this.attendanceId = 0;
        this.listOfResponse = new Array<Response>();
    }
    accommodationId:number;
    attendanceId: number; 
    listOfResponse: Array<Response>;
}
