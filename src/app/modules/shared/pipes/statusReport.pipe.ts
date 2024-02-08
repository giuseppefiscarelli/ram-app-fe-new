import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusReport'
})
export class StatusReportPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'generated':return  'Documento Generato';
      default:return  'In attesa';

  }
  }

}
