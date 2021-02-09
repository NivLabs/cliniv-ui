import { AnamnesisItem } from "./AnamnesisItem";

export class AnamnesisForm {
    id: number;
    title: string;
    questions: Array<AnamnesisItem>;
}

export class AnamnesisFormFilter {
    id: number;
    title: string;
}