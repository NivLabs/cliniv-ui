import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css']
})
export class SectorComponent implements OnInit {

  sectorNotFound = true;
  loading = false;
  sectors = [];

  constructor() { }

  ngOnInit(): void {
  }

  openDialog() {

  }
}
