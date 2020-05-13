
/**
 * Tipo de evento para Atendimento (Attendance)
 */
export class EventType {
    id: number;
    superEventType: EventType;
    name: string;
    description: string;
}