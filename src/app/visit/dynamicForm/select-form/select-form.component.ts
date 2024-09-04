import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { DynamicForm } from 'app/model/DynamicForm';
import { Page, Pageable } from 'app/model/Util';
import { AttDynamicFormComponent } from '../att-dynamic-form.component';
import { DynamicFormService } from '../dynamic-form.service';

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.css']
})
export class SelectFormComponent implements OnInit {

  constructor(
    private principalService: DynamicFormService,
    private dialogRef: MatDialogRef<SelectFormComponent>,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DynamicForm,
    private router: Router) { }

  public datas: Array<DynamicForm>;
  public selectedForm: DynamicForm;
  public loading: boolean = false;
  public page: Page;
  public pageSettings: Pageable;
  public attendanceId: number;
  public dataControl = new UntypedFormControl('', [Validators.required]);


  ngOnInit(): void {
    if (this.dialogRef.componentInstance.data['attendanceId'] !== null) {
      this.attendanceId = this.dialogRef.componentInstance.data['attendanceId'];
      this.loading = true;
      this.page = new Page();
      this.pageSettings = new Pageable();
      this.pageSettings.size = 100;

      this.principalService.getPageOfForms(null, this.pageSettings).then(resp => {
        this.loading = false;
        this.datas = resp.content;
        this.page = resp;
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, null);
      });
    } else {
      this.notification.showWarning("Nenhum atendimento encontrado");
      this.onCancelClick();
    }
  }

  /**
   * Seleciona formulário
   * @param id Idenfificador do formulário
   */
  selectData(id) {
    if (id) {
      this.selectedForm = new DynamicForm();
      this.selectedForm.id = id;
    } else {
      this.selectedForm = null;
    }
  }

  /**
   * Valida formulário
   */
  formValid() {
    return this.selectedForm && this.selectedForm.id > 0;
  }


  gotToVisit(attendanceId) {
    this.dialogRef.close();
    this.router.navigate(['visit', { attendanceId: attendanceId }]);
  }

  /**
   * Confirma a seleção de um formulário
   */
  save() {
    if (this.selectedForm) {
      this.loading = true;
      this.principalService.findById(this.selectedForm.id)
        .then(resp => {
          this.loading = false;
          this.dialog.open(AttDynamicFormComponent, {
            width: '100%',
            data: { attendanceId: this.attendanceId, form: resp }
          });

        }).catch(error => {
          this.loading = false;
          this.errorHandler.handle(error, this.dialogRef);
        });
    } else {
      this.notification.showError("Selecione um formulário");
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }

}
