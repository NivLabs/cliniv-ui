import { Customer } from "./Customer";
import { Parameter } from "./Parameter";

/**
 * Classe que representa as configurações
 */
export class SeetingsInfo {
    appName: string;
    version: string;
    customerInfo: Customer = new Customer();
    parameters: Array<Parameter> = new Array<Parameter>();
}
