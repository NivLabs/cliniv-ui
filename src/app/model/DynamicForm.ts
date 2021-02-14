import { DynamicFormItem } from "./DynamicFormItem";

export class DynamicForm {
    id: number;
    title: string;
    questions: Array<DynamicFormItem>;
}

export class DynamicFormFilter {
    id: number;
    title: string;
}