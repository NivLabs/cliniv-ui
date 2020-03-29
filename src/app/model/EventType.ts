
/**
 * Tipo de evento para Atendimento (Visit)
 */
export class EventType {
    id: number;
    superEventType: EventType;
    name: string;
    description: string;
}