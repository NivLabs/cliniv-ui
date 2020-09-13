import { PatientHistory } from "./Attendance";
import { HealthPlan } from "./HealthPlan";
import { Person } from "./Person";

/**
 * Representa as informações detalhadas do paciente
 */
export class PatientInfo extends Person {
    susNumber: string;
    type: string;
    healthPlan?: HealthPlan = new HealthPlan();
    annotations: string;
    attendanceHistory: Array<PatientHistory>;
}

export class PatientFilters {
    id: number;
    fullName: string;
    socialName: string;
    cpf: string;
    susNumber: string;
    type: string;
}