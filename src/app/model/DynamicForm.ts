import { DynamicFormQuestion } from "./DynamicFormQuestion";

export class DynamicForm {
    id: number;
    title: string;
    questions: Array<DynamicFormQuestion>;
}

export class DynamicFormFilter {
    id: number;
    title: string;
}