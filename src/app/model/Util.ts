/**
 * Página para requisições paginadas
 */
export class Page {
    content: Array<any>;
    empty: boolean = true;
    first: boolean = true;
    last: boolean = true;
    number: number;
    numberOfElements: number;
    pageable: Pageable;
    size: number = 0;
    totalElements: number = 0;
    totalPages: number = 0;
}

/**
 * Filtro de paginação
 */
export class Pageable {
    page: number = 0;
    size: number = 24;
}


/**
 * Via de administração
 */
export class RouteOfAdministration {
    id: number;
    value: string;
}


/**
 * Unidade de medida
 */
export class UnitOfMeasurement {
    id: number;
    value: string;
    description: string;
}

export const listOfUnitOfMeasurements: Array<UnitOfMeasurement> = [{ id: 1, value: 'AMP', description: 'Ampola' },
{ id: 2, value: 'BUI', description: 'Bilhões de Unidades Internacionais' },
{ id: 3, value: 'BG', description: 'Bisnaga' },
{ id: 4, value: 'BOLS', description: 'Bolsa' },
{ id: 5, value: 'CX', description: 'Caixa' },
{ id: 6, value: 'CAP', description: 'Cápsula' },
{ id: 7, value: 'CARP', description: 'Carpule' },
{ id: 8, value: 'COM', description: 'Comprimido' },
{ id: 9, value: 'DOSE', description: 'Dose' },
{ id: 10, value: 'DRG', description: 'Drágea' },
{ id: 11, value: 'ENV', description: 'Envelope' },
{ id: 12, value: 'FLAC', description: 'Flaconete' },
{ id: 13, value: 'FR', description: 'Frasco' },
{ id: 14, value: 'FA', description: 'Frasco Ampola' },
{ id: 15, value: 'GAL', description: 'Galão' },
{ id: 16, value: 'GLOB', description: 'Glóbulo' },
{ id: 17, value: 'GTS', description: 'Gotas' },
{ id: 18, value: 'G', description: 'Grama' },
{ id: 19, value: 'L', description: 'Litro' },
{ id: 20, value: 'MCG', description: 'Microgramas' },
{ id: 21, value: 'MUI', description: 'Milhões de Unidades Internacionais' },
{ id: 22, value: 'MG', description: 'Miligrama' },
{ id: 23, value: 'ML', description: 'Milílitro' },
{ id: 24, value: 'OVL', description: 'Óvulo' },
{ id: 25, value: 'PAS', description: 'Pastilha' },
{ id: 26, value: 'LT', description: 'Lata' },
{ id: 27, value: 'PER', description: 'Pérola' },
{ id: 28, value: 'PIL', description: 'Pílula' },
{ id: 29, value: 'PT', description: 'Pote' },
{ id: 30, value: 'KG', description: 'Quilograma' },
{ id: 31, value: 'SER', description: 'Seringa' },
{ id: 32, value: 'SUP', description: 'Supositório' },
{ id: 33, value: 'TABLE', description: 'Tablete' },
{ id: 34, value: 'TUB', description: 'Tubete' },
{ id: 35, value: 'TB', description: 'Tubo' },
{ id: 36, value: 'UN', description: 'Unidade' },
{ id: 37, value: 'UI', description: 'Unidade Internacional' },
{ id: 38, value: 'CM', description: 'Centímetro' },
{ id: 39, value: 'CONJ', description: 'Conjunto' },
{ id: 40, value: 'KIT', description: 'Kit' },
{ id: 41, value: 'MÇ', description: 'Maço' },
{ id: 42, value: 'M', description: 'Metro' },
{ id: 43, value: 'PC', description: 'Pacote' },
{ id: 44, value: 'PÇ', description: 'Peça' },
{ id: 45, value: 'RL', description: 'Rolo' },
{ id: 46, value: 'GY', description: 'Gray' },
{ id: 47, value: 'CGY', description: 'Centgray' },
{ id: 48, value: 'PAR', description: 'Par' },
{ id: 49, value: 'ADES', description: 'Adesivo Transdérmico' },
{ id: 50, value: 'COM EFEV', description: 'Comprimido Efervecente' },
{ id: 51, value: 'COM MST', description: 'Comprimido Mastigável' },
{ id: 52, value: 'SACHE', description: 'Sache' }
]