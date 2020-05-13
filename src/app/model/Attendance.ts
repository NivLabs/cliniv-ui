import { Person } from "./Person";


export class AttendanceInfo extends Person {
    type: string;
    idPatient: number;
    susNumber: number;
    idSector: number;
}

export class AttendanceFilters {
    sector: number;
    firstName: string;
    lastName: string;
    cpf: string;
    typePatient: string;
    typeAttendance: string;
}