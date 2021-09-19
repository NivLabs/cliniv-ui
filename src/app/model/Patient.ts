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
    attendanceHistory: Array<PatientHistory> = [];
    allergies: Array<any> = [];
}

export class PatientFilters {
    id: number;
    fullName: string;
    socialName: string;
    cpf: string;
    cnsNumber: string;
    type: string;
}