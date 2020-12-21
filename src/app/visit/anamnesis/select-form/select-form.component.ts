import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { AnamnesisForm } from 'app/model/AnamnesisForm';
import { Page, Pageable } from 'app/model/Util';
import { AnamnesisComponent } from '../anamnesis.component';
import { AnamnesisService } from '../anamnesis.service';

@Component({
  selector: 'app-select-form',
  templateUrl: './select-form.component.html',
  styleUrls: ['./select-form.component.css']
})
export class SelectFormComponent implements OnInit {

  constructor(
    private principalService: AnamnesisService,
    private dialogRef: MatDialogRef<SelectFormComponent>,
    private errorHandler: ErrorHandlerService,
    private notification: NotificationsComponent,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AnamnesisForm,
    private router: Router) { }

  public datas: Array<AnamnesisForm>;
  public selectedForm: AnamnesisForm;
  public loading: boolean = false;
  public page: Page;
  public pageSettings: Pageable;
  public attendanceId: number;
  public dataControl = new FormControl('', [Validators.required]);


  ngOnInit(): void {
    if (this.dialogRef.componentInstance.data['attendanceId'] !== null) {
      this.attendanceId = this.dialogRef.componentInstance.data['attendanceId'];
      this.loading = true;
      this.page = new Page();
      this.pageSettings = new Pageable();
      this.pageSettings.size = 100;

      this.principalService.getPageOfForms(this.pageSettings).then(resp => {
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
   * Seleciona formulário de anamnese
   * @param id Idenfificador do formulário
   */
  selectData(id) {
    if (id) {
      this.selectedForm = new AnamnesisForm();
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
   * Confirma a seleção de um formulário de anamnese
   */
  save() {
    if (this.selectedForm) {
      this.loading = true;
      this.principalService.findById(this.selectedForm.id)
        .then(resp => {
          this.loading = false;
          this.dialog.open(AnamnesisComponent, {
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
