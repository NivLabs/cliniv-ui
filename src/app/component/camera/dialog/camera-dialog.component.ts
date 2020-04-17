import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-camera-dialog',
  templateUrl: './camera-dialog.component.html',
  styleUrls: ['./camera-dialog.component.css']
})
export class CameraDialogComponent implements OnInit {

  public webCamImage: WebcamImage = null;

  constructor(public dialogRef: MatDialogRef<CameraDialogComponent>) { }

  ngOnInit(): void {
    console.log(this.webCamImage);
  }

  handleImage(webCamImage: WebcamImage) {
    this.webCamImage = webCamImage;
  }

  cleanImage() {
    this.webCamImage = null;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
