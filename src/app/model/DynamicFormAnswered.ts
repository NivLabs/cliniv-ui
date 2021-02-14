import { Response } from "./Response";

/**
 * Classe que representa as respostas referente ao formulário de um atendimento
 */
export class DynamicFormAnswered {   
    constructor() { 
        this.listOfResponse = new Array<Response>();
    }
    documentTitle: string;
    listOfResponse: Array<Response>;
}
