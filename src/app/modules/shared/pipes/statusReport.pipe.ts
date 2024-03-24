import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusReport'
})
export class StatusReportPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'generated':return  'Documento Generato';
      case 'prepared':return  'Pec Convalidata';
      case 'pending':return  'Pec da Inviare';
      case 'completed': return 'Pec Inviata';
      case 'sent': return 'Pec Inviata';
      default:return  'In attesa';

  }
  }

}
