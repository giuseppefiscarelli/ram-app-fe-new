import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phase'
})
export class PhasePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(!value){
      return null;
    }

    switch (value) {
      case 'assembly':   return 'Assemblaggio'
      case 'cutting':  return 'Taglio'
    }
  }

}
