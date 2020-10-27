
/**
 * Tipo de evento para Atendimento (Attendance)
 */
export class EventType {
    id: number = 10;
    superEventType: EventType;
    name: string;
    description: string;
}