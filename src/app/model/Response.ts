import { DynamicFormItem } from "./DynamicFormItem";

/**
 * Classe que representa as respostas
 */
export class Response {
    constructor() { 
        this.response = "";
        this.dynamicFormItem = new DynamicFormItem();
    }
    response: string;
    dynamicFormItem: DynamicFormItem;
}
