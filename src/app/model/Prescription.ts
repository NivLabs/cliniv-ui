import { RouteOfAdministration, UnitOfMeasurement } from './Util';

/**
 * Prescrição do atendimento
 */
export class Prescription {
    attendanceId: number;
    datetimeInit: Date;
    datetimeEnd: Date;
    items: Array<PrescriptionItem> = []
}

/**
 * Item da prescrição
 */
export class PrescriptionItem {
    sequential: number;
    description: string;
    observations: string;
    routeOfAdministration: string;
    dosage: number;
    unitOfMeasurement: UnitOfMeasurement;
    timeInterval: number;
    timeIntervalType: string;
}