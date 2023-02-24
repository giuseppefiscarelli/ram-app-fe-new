import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority'
})
export class PriorityPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(!value){
      return null;
    }

    switch (value) {
      case'1': return 'Bassa';
      case '2': return 'Standard';
      case '3': return 'Urgente';
  }
}

}
