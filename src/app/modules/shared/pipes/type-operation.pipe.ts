import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeOperation'
})
export class TypeOperationPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(!value){
      return null;
    }
    switch (value) {
      case 'fianchi':   return {text:'Fianchi'};
      case 'teste':   return {text:'Teste'}
      case 'coperchi':  return {text:'Coperchi'};
      case 'base':      return {text:'Base'};
      case 'fissaggi':   return {text:'Fissaggi'};
      case 'selle':   return {text:'Selle'}
      case 'cravatte':  return {text:'Cravatte'};
      case 'telaio-fianchi':      return {text:'Telaio  - Fianchi'};
      case 'telaio-teste':      return {text:'Telaio - Teste'};
      case 'telaio-cop':   return {text:'Telaio - Cop'};
      case 'riv-fianchi':   return {text:'Riv Fianchi'}
      case 'riv-teste':  return {text:'Riv Teste'};
      case 'riv-cop':      return {text:'Riv Cop'};
    }
  }

}
