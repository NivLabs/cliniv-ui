import { Component, OnInit } from '@angular/core';
import { ConvenantFilter } from 'app/model/Convenant';

@Component({
  selector: 'app-convenant',
  templateUrl: './convenant.component.html',
  styleUrls: ['./convenant.component.scss']
})
export class ConvenantComponent implements OnInit {

  private filters = ConvenantFilter;

  constructor() { }

  ngOnInit(): void {
  }


  enterKeyPress(event: any) {
    if (event.key === "Enter") {
      this.applyFilter();
    }
  }

  applyFilter() {

  }
}
