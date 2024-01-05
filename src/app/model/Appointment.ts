import { PatientInfo } from "./Patient";
import { Professional } from "./Professional";

/**
 * Objeto que representa informações detalhadas de um agendamento
 */
export class AppointmentInfo {
    id: number;
    patient: PatientInfo = new PatientInfo();
    professional: Professional = new Professional();
    schedulingDateAndTime: string;
    repeatSettings: AppointmentRecurrenceSettings = new AppointmentRecurrenceSettings();
    annotation: string;
    status: string = "WAITING_CONFIRMATION";
    attendanceEvent
    createdAt: Date;
}

export class GetAppointmentResponse {
    content: Appointment[];
    daysWithAppointment: number[];
}

/**
 * Informações resumidas de agenda
 */
export class Appointment {
    id: number;
    patientName: string;
    patientCpf: string;
    professionalId: number;
    professionalName: string;
    schedulingDateAndTime: string;
    status: string = 'WAITING_CONFIRMATION';
}

export class AppointmentFilter {
    professionalId: number;
    startDate: any;
    endDate: any;
    status: string;
}

export class AppointmentParameters {
    initialAttendanceTime: string = "08:00";
    endAttendanceTime: string = "18:00";
    timeIntervalInMinutes: number = 30;

}

export class AppointmentRecurrenceSettings {
    numberOfOccurrences: number = 0;
    intervalType: string = "DAILY";
    businessDaysOnly: boolean = true;
}