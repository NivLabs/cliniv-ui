import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatCurrency, formatMaskedNumber, parseMaskedNumber } from 'app/model/format.util';

/**
 * Tipo de desconto escolhido pelo usuário. É um conceito puramente de UI: o backend só
 * conhece o valor final (`discountValue`, um valor absoluto) — o tipo nunca é persistido,
 * só usado aqui para calcular esse valor a partir do valor bruto do lançamento.
 */
export type DiscountType = 'FIXED' | 'PERCENTAGE';

export class DiscountDialogData {
    type: DiscountType;
    value: number;
    grossValue: number;
}

@Component({
    selector: 'app-discount-dialog',
    templateUrl: './discount-dialog.component.html',
    styleUrls: ['./discount-dialog.component.css']
})
export class DiscountDialogComponent {

    type: DiscountType;
    valueDisplay: string;
    value = 0;
    grossValue: number;

    constructor(
        public dialogRef: MatDialogRef<DiscountDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DiscountDialogData) {
        this.dialogRef.disableClose = true;
        this.type = data && data.type ? data.type : 'FIXED';
        this.grossValue = data && data.grossValue ? data.grossValue : 0;
        this.value = data && data.value ? data.value : 0;
        this.valueDisplay = formatMaskedNumber(this.value);
    }

    get previewValue(): number {
        if (this.type === 'PERCENTAGE') {
            return parseFloat(((this.grossValue || 0) * ((this.value || 0) / 100)).toFixed(2));
        }
        return this.value || 0;
    }

    get previewValueFormatted(): string {
        return formatCurrency(this.previewValue);
    }

    onTypeChange(): void {
        // Troca de tipo zera o valor: um percentual e um valor fixo não são intercambiáveis.
        this.value = 0;
        this.valueDisplay = formatMaskedNumber(0);
    }

    onValueDisplayChange(display: string): void {
        this.value = parseMaskedNumber(display);
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    confirm(): void {
        this.dialogRef.close({ type: this.type, value: this.value || 0 } as DiscountDialogData);
    }

}
