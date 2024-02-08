import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-viewer',
  template: `
  <pdf-viewer [src]="pdfSrc"
              [render-text]="true"
              [original-size]="false"
              style="width: 80vh; height:80vh;"
  ></pdf-viewer>
  `,
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerSharedComponent implements OnInit {
  pdfSrc :string
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,) {
    console.log(data)
    this.pdfSrc = data.url
   }

  ngOnInit() {
  }

}
