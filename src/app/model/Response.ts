import { DynamicFormQuestion } from "./DynamicFormQuestion";

/**
 * Classe que representa as respostas
 */
export class Response {
    constructor() { 
        this.response = "";
        this.dynamicFormQuestion = new DynamicFormQuestion();
    }
    response: string;
    dynamicFormQuestion: DynamicFormQuestion;
}
