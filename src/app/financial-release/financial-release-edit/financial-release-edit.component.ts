import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { FinancialReleaseService } from '../financial-release.service';
import { FinancialRelease, financialReleaseStatuses, financialReleaseTypes } from 'app/model/FinancialRelease';
import { FinancialCategoryService } from 'app/financial-category/financial-category.service';
import { FinancialCategory, FinancialCategoryFilters } from 'app/model/FinancialCategory';
import { PaymentMethodService } from 'app/payment-method/payment-method.service';
import { PaymentMethod, PaymentMethodFilters } from 'app/model/PaymentMethod';
import { PatientService } from 'app/patient/patient.service';
import { PatientFilters } from 'app/model/Patient';
import { Pageable } from 'app/model/Util';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { DiscountDialogComponent, DiscountDialogData, DiscountType } from 'app/core/discount-dialog/discount-dialog.component';
import { formatCurrency, formatMaskedNumber, parseMaskedNumber } from 'app/model/format.util';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

const PATIENT_SEARCH_MIN_LENGTH = 3;

@Component({
  selector: 'app-financial-release-edit',
  templateUrl: './financial-release-edit.component.html'
})
export class FinancialReleaseEditComponent implements OnInit, OnDestroy {

  public loading = false;
  public dataToForm: FinancialRelease;

  public financialReleaseTypes = financialReleaseTypes;
  public financialReleaseStatuses = financialReleaseStatuses;

  public categories: FinancialCategory[] = [];
  public paymentMethods: PaymentMethod[] = [];

  public patients = [];
  public loadingPatientAutocomplete = false;
  public patientSearchTermTooShort = true;

  // Valores exibidos nos inputs com máscara (ngx-mask escreve/lê a versão formatada em
  // pt-BR — '.' milhar, ',' decimal — que precisa ser convertida para number antes de ir
  // pro dataToForm, ver parseMaskedNumber/formatMaskedNumber em model/format.util.ts).
  public grossValueDisplay = formatMaskedNumber(0);
  public netValueDisplay = formatMaskedNumber(0);

  // Tipo de desconto é só um conceito de UI (ver DiscountDialogComponent) — o backend só
  // recebe o valor final calculado em dataToForm.discountValue.
  public discountType: DiscountType = 'FIXED';
  public discountInputValue = 0;

  private patientSearchInputEl: ElementRef;
  private patientSearchSub: Subscription;

  // Mesmo padrão de appointment-edit.component.ts: o input só existe no DOM quando nenhum
  // paciente ainda foi selecionado (*ngIf="!dataToForm.patientId" no template) — setter em
  // vez de {static: true} garante que a assinatura seja refeita sempre que o elemento
  // entrar/sair da view.
  @ViewChild('patientSearch') set patientSearchInput(el: ElementRef) {
    this.patientSearchInputEl = el;
    if (this.patientSearchSub) {
      this.patientSearchSub.unsubscribe();
      this.patientSearchSub = null;
    }
    if (el) {
      this.patientSearchSub = fromEvent(el.nativeElement, 'keyup').pipe(
        map((event: any) => event.target.value),
        distinctUntilChanged(),
        debounceTime(300)
      ).subscribe((text: string) => {
        this.patientSearchTermTooShort = !text || text.length < PATIENT_SEARCH_MIN_LENGTH;
        if (this.patientSearchTermTooShort) {
          this.patients = [];
          return;
        }
        this.searchPatientsByName(text);
      });
    }
  }

  constructor(
    public principalService: FinancialReleaseService,
    public confirmDialog: MatDialog,
    public dialogRef: MatDialogRef<FinancialReleaseEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent,
    private categoryService: FinancialCategoryService,
    private paymentMethodService: PaymentMethodService,
    private patientService: PatientService) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new FinancialRelease();
  }

  ngOnInit(): void {
    const selectedRelease = this.data ? this.data['selectedRelease'] : null;
    if (selectedRelease) {
      this.dataToForm = { ...selectedRelease };
      // O backend só guarda o valor final do desconto, não o tipo — ao editar um lançamento
      // existente, assume-se "valor fixo" (o próprio discountValue já persistido).
      this.discountInputValue = this.dataToForm.discountValue || 0;
    } else {
      this.dataToForm.competenceDate = this.todayIso();
    }
    this.grossValueDisplay = formatMaskedNumber(this.dataToForm.grossValue);
    this.netValueDisplay = formatMaskedNumber(this.dataToForm.netValue);
    this.loadCategories();
    this.loadPaymentMethods();
  }

  ngOnDestroy(): void {
    if (this.patientSearchSub) {
      this.patientSearchSub.unsubscribe();
    }
  }

  private todayIso(): string {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }

  private loadCategories() {
    this.categoryService.getPage(new FinancialCategoryFilters(), { page: 0, size: 100 } as Pageable)
      .then(response => {
        this.categories = response.content;
        // Só faz sentido pré-selecionar em um lançamento novo — editando um já existente,
        // a categoria vinda do registro prevalece.
        if (!this.dataToForm.id && this.categories.length === 1) {
          this.dataToForm.categoryId = this.categories[0].id;
        }
      });
  }

  private loadPaymentMethods() {
    this.paymentMethodService.getPage(new PaymentMethodFilters(), { page: 0, size: 100 } as Pageable)
      .then(response => this.paymentMethods = response.content);
  }

  searchPatientsByName(text: string) {
    this.loadingPatientAutocomplete = true;
    const filters = new PatientFilters();
    filters.fullName = text;
    this.patientService.getPage(filters, { page: 0, size: 20 } as Pageable).then(response => {
      this.loadingPatientAutocomplete = false;
      this.patients = response.content;
    }).catch(error => {
      this.loadingPatientAutocomplete = false;
      this.errorHandler.handle(error, null);
    });
  }

  selectPatient(patient: any) {
    this.dataToForm.patientId = patient.id;
    this.dataToForm.patientName = patient.fullName;
    this.patients = [];
  }

  clearSelectedPatient() {
    this.dataToForm.patientId = null;
    this.dataToForm.patientName = null;
    this.patients = [];
  }

  onGrossValueChange(display: string) {
    this.dataToForm.grossValue = parseMaskedNumber(display);
    this.recalculateNetValue();
  }

  recalculateNetValue() {
    // Desconto percentual acompanha o valor bruto — se ele mudar depois de um desconto em
    // % já escolhido, o valor absoluto (discountValue, o único que o backend conhece) é
    // recalculado para continuar representando o mesmo percentual.
    if (this.discountType === 'PERCENTAGE') {
      this.dataToForm.discountValue = parseFloat(((this.dataToForm.grossValue || 0) * (this.discountInputValue / 100)).toFixed(2));
    }
    const gross = this.dataToForm.grossValue || 0;
    const discount = this.dataToForm.discountValue || 0;
    this.dataToForm.netValue = parseFloat((gross - discount).toFixed(2));
    this.netValueDisplay = formatMaskedNumber(this.dataToForm.netValue);
  }

  get discountSummary(): string {
    if (!this.dataToForm.discountValue) {
      return 'Nenhum desconto aplicado';
    }
    if (this.discountType === 'PERCENTAGE') {
      return `${this.discountInputValue}% (${formatCurrency(this.dataToForm.discountValue)})`;
    }
    return formatCurrency(this.dataToForm.discountValue);
  }

  openDiscountDialog() {
    const dialogRef = this.confirmDialog.open(DiscountDialogComponent, {
      width: '400px',
      data: {
        type: this.discountType,
        value: this.discountInputValue,
        grossValue: this.dataToForm.grossValue
      } as DiscountDialogData
    });

    dialogRef.afterClosed().subscribe((result: DiscountDialogData) => {
      if (!result) {
        return;
      }
      this.discountType = result.type;
      this.discountInputValue = result.value;
      this.dataToForm.discountValue = result.type === 'PERCENTAGE'
        ? parseFloat(((this.dataToForm.grossValue || 0) * (result.value / 100)).toFixed(2))
        : result.value;
      this.recalculateNetValue();
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.loading = true;
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.loading = false;
        this.notification.showSucess("Lançamento financeiro alterado com sucesso!");
        this.dataToForm = resp;
        this.syncDisplaysFromForm();
      }).catch((error) => this.handlerException(error));
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.loading = false;
        this.dataToForm = resp;
        this.syncDisplaysFromForm();
        this.notification.showSucess("Lançamento financeiro cadastrado com sucesso!");
      }).catch((error) => this.handlerException(error));
    }
  }

  private syncDisplaysFromForm() {
    this.grossValueDisplay = formatMaskedNumber(this.dataToForm.grossValue);
    this.netValueDisplay = formatMaskedNumber(this.dataToForm.netValue);
    this.discountInputValue = this.dataToForm.discountValue || 0;
  }

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm = new FinancialRelease();
        this.dataToForm.competenceDate = this.todayIso();
        this.discountType = 'FIXED';
        this.discountInputValue = 0;
        this.syncDisplaysFromForm();
        if (this.categories.length === 1) {
          this.dataToForm.categoryId = this.categories[0].id;
        }
      }
    });
  }

  handlerException(error) {
    this.loading = false;
    this.errorHandler.handle(error, this.dialogRef);
  }

}
