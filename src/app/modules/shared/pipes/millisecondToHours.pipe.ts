
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'MillisecondsToHours'
})
export class MillisecondsToHours implements PipeTransform {
  transform(value: number): string {
    value = value / 1000 / 60;
    const hours = Math.floor( value / 60 );
    let minutes = value % 60 === 0 ? '00' : value % 60;
    if( Number( minutes ) < 10 && Number( minutes ) > 0){ minutes = '0'+ Number( minutes ).toFixed(0) }
    return hours + ':' + minutes;
  }
}
