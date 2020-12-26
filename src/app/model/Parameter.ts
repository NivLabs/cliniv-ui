export class ParameterByGroup {
    group: string;
    parameters: Array<Parameter>;
}

/**
 * Classe que representa as informações do parâmetro
 */
export class Parameter {
    id: number;
    name: string;
    group: string;
    value: any;
    groupValues: string;
    metaType: string;
}
