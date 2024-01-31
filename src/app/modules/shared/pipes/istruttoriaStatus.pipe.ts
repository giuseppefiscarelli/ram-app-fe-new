import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'istruttoriaStatus'
})
export class IstruttoriaStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
        case 'enabled':return  'Attiva';
        case 'disabled':return  'Non Attiva';
        case 'work' : return 'In lavorazione';
        case 'pending' : return 'In attesa di lavorazione';
        case 'rend' : return 'In rendicontazione';
        case 'closed' : return 'Istruttoria Chiusa';
        case 'rendOpen' : return 'In attesa chiusura rendicontazione';

    }
  }
}
