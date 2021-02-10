import { AnamnesisItem } from "./AnamnesisItem";

export class DynamicForm {
    id: number;
    title: string;
    questions: Array<AnamnesisItem>;
}

export class DynamicFormFilter {
    id: number;
    title: string;
}