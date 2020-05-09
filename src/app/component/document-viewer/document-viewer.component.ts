import { Component, OnInit } from '@angular/core';
import { DigitalDocument } from 'app/model/DigitalDocument';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {

  document: DigitalDocument;

  constructor() { }

  ngOnInit(): void {
    this.document = new DigitalDocument();
  }

}
