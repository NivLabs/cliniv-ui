export class DocumentTemplate {
    id: number;
    description: string;
}

export class DocumentTemplateInfo {
    id: number;
    description: string;
    text: string;
}

export class DocumentTemplateFilter {
    orderBy :string = 'description';
    description: string;
}