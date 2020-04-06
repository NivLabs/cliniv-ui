import { Component, OnInit, ErrorHandler } from '@angular/core';
import { ErrorHandlerService } from 'app/core/error-handler.service';
import { SectorService } from './sector.service';
import { SectorEditComponent } from './sector-edit/sector-edit.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css']
})
export class SectorComponent implements OnInit {

  public loading: boolean;
  public sectorNotFound: boolean;
  sectors = [];

  constructor(public dialog: MatDialog, private errorHandler: ErrorHandlerService, private sectorService: SectorService) { }

  ngOnInit(): void {
    this.loading = true;
    this.sectorService.getListOfSectors(null).then(response => {
      this.loading = false;
      this.sectors = response;
      this.sectorNotFound = this.sectors.length === 0;
    }).catch(error => {
      this.sectorNotFound = this.sectorNotFound !== undefined ? this.sectors.length === 0 : true;
      this.loading = false;
      this.errorHandler.handle(error, null);
    });
  }

  openDialog(sector): void {
    console.log(sector)
    const dialogRef = this.dialog.open(SectorEditComponent, {
      width: '70%',
      data: sector
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}
