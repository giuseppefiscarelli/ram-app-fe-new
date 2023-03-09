import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rendStatus'
})
export class RendStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    switch (value) {
        case 'pending':return  'Attiva';
        case 'canceled':return  'Annullata';
        case 'opened':return  'In Rendicontazione';
        case 'closed':return  'Rendicontazione Chiusa';


        default:return  'Attiva';

    }
  }

}
