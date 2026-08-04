import { Appointment } from "./Appointment";
import { PatientHistory } from "./Attendance";
import { HealthPlan } from "./HealthPlan";
import { Person } from "./Person";

/**
 * Representa as informações detalhadas do paciente
 */
export class PatientInfo extends Person {
    cnsNumber: string;
    type: string;
    healthPlan?: HealthPlan = new HealthPlan();
    annotations: string;
    isMinor?: boolean = false;
    guardianName?: string;
    attendanceHistory: Array<PatientHistory> = [];
    allergies: Array<any> = [];
    lifetimeDescription: string;
    upcomingAppointments: Array<Appointment> = []
}

/**
 * Pré-cadastro rápido de paciente (nome + telefone), usado no agendamento
 */
export class PatientQuickCreate {
    fullName: string = "";
    principalNumber: string = "";
    isMinor: boolean = false;
    guardianName: string;
}

export class PatientFilters {
    id: number;
    fullName: string;
    socialName: string;
    cpf: string;
    cnsNumber: string;
    type: string;
}