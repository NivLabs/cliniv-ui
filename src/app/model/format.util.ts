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

/**
 * Converte para number uma string no formato pt-BR usado pelos inputs com máscara ngx-mask
 * deste app ('.' como separador de milhar, ',' como marcador decimal — ex: "1.234,56").
 */
export function parseMaskedNumber(display: string): number {
    if (!display) {
        return 0;
    }
    const normalized = display.toString().replace(/\./g, '').replace(',', '.');
    const value = parseFloat(normalized);
    return isNaN(value) ? 0 : value;
}

/**
 * Formata um number no mesmo padrão pt-BR ('.' milhar, ',' decimal) usado pelos inputs com
 * máscara — usado para preencher o valor inicial desses campos a partir de dados já carregados.
 */
export function formatMaskedNumber(value: number): string {
    return (value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
