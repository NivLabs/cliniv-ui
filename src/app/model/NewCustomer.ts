export class NewCustomerRequest {
    clinicName: string;
    managerName: string;
    cgcType: string = 'CNPJ';
    cgc: string;
    principalPhone: string;
    email: string;
}
