import { PatientInfo } from "./Patient";
import { Professional } from "./Professional";

/**
 * Objeto que representa informações detalhadas de um agendamento
 */
export class ScheduleInfo {
    id: number;
    patient: PatientInfo;
    professional: Professional;
    schedulingDateAndTime: Date;
    annotation: string;
    status: string;
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