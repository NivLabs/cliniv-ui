import { CurrencyPipe, DatePipe } from '@angular/common';

/**
 * Helpers usados pelas colunas de app-data-table para reproduzir, em código, a mesma
 * formatação que antes era feita nos templates dos cards via pipes (| mask, | date, | currency).
 * Locale fixado em 'en-US' de propósito: é o locale padrão do Angular quando nenhum
 * LOCALE_ID é registrado (não é o caso deste app), reproduzindo o comportamento atual.
 */

const datePipe = new DatePipe('en-US');
const currencyPipe = new CurrencyPipe('en-US');

export function formatCpf(cpf: string): string {
    if (!cpf) {
        return '';
    }
    const digits = cpf.replace(/\D/g, '');
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatPhone(phone: string): string {
    if (!phone) {
        return 'Não informado';
    }
    const digits = phone.replace(/\D/g, '');
    return digits.length <= 10
        ? digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
        : digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function formatDate(value: string | Date): string {
    return value ? datePipe.transform(value, 'dd/MM/yyyy') : '';
}

export function formatDateTime(value: string | Date): string {
    return value ? datePipe.transform(value, 'dd/MM/yyyy HH:mm') : '';
}

export function formatCurrency(value: number): string {
    return value !== null && value !== undefined ? currencyPipe.transform(value, 'BRL') : '';
}
