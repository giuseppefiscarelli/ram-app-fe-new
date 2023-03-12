import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dimImpresa'
})
export class DimImpresaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!value){
        return null;
    }
    switch (value) {
        case 'toWork': return 'Da verificare';
        case 1: return 'Piccola'
        case 2: return 'Media';
        case 3 : return 'Grande';

    }
  }

}
