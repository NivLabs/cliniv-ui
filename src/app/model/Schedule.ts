import { PatientInfo } from "./Patient";
import { Professional } from "./Professional";

/**
 * Objeto que representa informações detalhadas de um agendamento
 */
export class ScheduleInfo {
    id: number;
    patient: PatientInfo = new PatientInfo();
    professional: Professional = new Professional();
    schedulingDateAndTime: string;
    annotation: string;
    status: string;
    createdAt: Date;
}

export class ScheduleFilter {
    professionalId: number;
    selectedDate: string;
    status: string;
}

export class ScheduleParameters {
    initialAttendanceTime: string = "08:00";
    endAttendanceTime: string = "18:00";
    timeIntervalInMinutes: number = 30;

}