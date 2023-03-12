import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'istruttoriaStatus'
})
export class IstruttoriaStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
        case 'enabled':return  'Attiva';
        case 'disabled':return  'Non Attiva';


    }
  }
}
