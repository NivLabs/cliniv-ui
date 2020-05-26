import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NotificationsComponent } from 'app/core/notification/notifications.component';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorService } from '../sector.service';
import { UtilService } from 'app/core/util.service';
import { FormBuilder } from '@angular/forms';
import { Sector } from 'app/model/Sector';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/core/confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { Accommodation } from 'app/model/Accommodation';
import { AccommodationComponent } from 'app/sector/accommodation/accommodation.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-sector-edit',
  templateUrl: './sector-edit.component.html'
})

export class SectorEditComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public loading = false;
  public dataToForm: Sector;
  public dataSource: any;
  public displayedColumns: any;
  public selectedSectorId: number;

  constructor(public principalService: SectorService, public confirmDialog: MatDialog, public dialog: MatDialog, public dialogRef: MatDialogRef<SectorEditComponent>, @Inject(MAT_DIALOG_DATA) public data: Sector, public formBuilder: FormBuilder, private utilService: UtilService, private patientService: SectorService, private errorHandler: ErrorHandlerService, private notification: NotificationsComponent) {
    this.dialogRef.disableClose = true;
    this.dataToForm = new Sector();
  }

  ngOnInit(): void {

    if (this.dialogRef.componentInstance.data['selectedSector'] !== null || this.selectedSectorId !== 0) {
      this.loading = true;
      this.selectedSectorId = this.dialogRef.componentInstance.data['selectedSector'];
      this.principalService.getById(this.selectedSectorId).then(resp => {
        this.loading = false;
        this.dataToForm = resp;       
        this.dataToForm.listOfRoomsOrBeds = this.dataToForm.listOfRoomsOrBeds.sort(function (a, b) {
          return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
        });
        this.dataSource = new MatTableDataSource(this.dataToForm.listOfRoomsOrBeds); 
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
      }).catch(error => {
        this.loading = false;       
        this.dataToForm = new Sector();        
        this.errorHandler.handle(error, this.dialogRef);
      });

      this.displayedColumns = ['description', 'actions'];
    }

  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    if (this.dataToForm.id) {
      this.principalService.update(this.dataToForm).then(resp => {
        this.dataToForm = resp;
        this.notification.showSucess("Setor alterado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    } else {
      this.principalService.create(this.dataToForm).then(resp => {
        this.dataToForm = resp;
        this.notification.showSucess("Setor cadastrado com sucesso!");
      }).catch(error => {
        this.loading = false;
        this.errorHandler.handle(error, this.dialogRef);
      });
    }
  }

  resetForm() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a limpeza do formulário?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.dataToForm = new Sector();
        this.dataToForm.listOfRoomsOrBeds = new Array<Accommodation>();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAccoommodationDialog(sectorId): void {    

    const dialogRef = this.dialog.open(AccommodationComponent, {
      width: '100%',
      height: 'auto',
      data: {sectorId: sectorId}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });

  }

  openEditAccoommodationDialog(accommodation): void {    
    
    const dialogRef = this.dialog.open(AccommodationComponent, {
      width: '100%',
      height: 'auto',
      data: {accommodation: accommodation}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });

  }

  openDeleteAccoommodationDialog(id){
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmação', message: 'Você confirma a exclusão da acomodação?' }
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.isConfirmed) {
        this.principalService.deleteAccommodation(id).then(resp => {
          this.ngOnInit();
          this.notification.showSucess("Acomodação excluída com sucesso!");
        }).catch(error => {
          this.loading = false;
          this.errorHandler.handle(error, this.dialogRef);
        });
      }
    });
  }

}
