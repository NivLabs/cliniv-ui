import { AnamnesisItem } from "./AnamnesisItem";

/**
 * Classe que representa as respostas
 */
export class Response {
    constructor() { 
        this.response = "";
        this.anamnesisItem = new AnamnesisItem();
    }
    response: string;
    anamnesisItem: AnamnesisItem;
}
