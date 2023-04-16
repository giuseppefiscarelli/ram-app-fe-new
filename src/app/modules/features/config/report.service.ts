import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Injectable()
export class ReportService {

constructor() { }



  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
    };

    img.onerror = error => {
        reject(error);
    };

    img.src = url;
    });
  }



   async generateReport(dataReport){
    console.log(dataReport);
//    return true

    let header = [];
    let content = [];
    if(dataReport){
      if(dataReport.headerData){
        let hd =dataReport.headerData
        console.log(hd)
        header.push({
          image:  await this.getBase64ImageFromURL(hd.logo ),
          width: hd.dimensions, margin: [
            hd.marginLeft,
            hd.marginTop,
            hd.marginRight,
            hd.marginBottom,

          ]
        })
      }

      if(dataReport.subHeaderData.length > 0){

        dataReport.subHeaderData.map(
          d=>  content.push(d)
        )

      }
      if(dataReport.test){
        dataReport.test.map(
          d=>  content.push(d)
        )
      }
    }
    var docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 20, 100, 20, 60 ],
      header:header,

      content: content,
    }

    const report = pdfMake.createPdf(docDefinition);

      return report





    // const url = await report.getDataUrl((dataUrl) => {
    //   console.log(dataUrl)
    //   return dataUrl
    // })
   // console.log('url',url)
  //  console.log(report)
   // return url
  }
}
