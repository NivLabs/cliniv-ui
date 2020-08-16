import { Document } from "./Document";
import { Address } from "./Address";

/**
 * Classe base de pessoa física
 */
export class Person {
    id: number;
    fullName: string = "";
    socialName: string = "";
    fatherName: string;
    motherName: string;
    identity: string;
    document?: Document = new Document('CPF');
    address?: Address = new Address();
    principalNumber: string;
    secondaryNumber: string;
    bornDate: Date;
    observations: string;
    gender: string;
    genderIdentity: string;
    createdAt: Date;
    profilePhoto: string;
}