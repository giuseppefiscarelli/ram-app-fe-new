import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'statusTask'})
export class StatusTaskPipe implements PipeTransform {

  transform(value: any, args?: any): any {


    if(!value){
      return null;
    }

    switch (value) {
      case 'scheduled':   return {text:'Programmata', icon:'schedule'};
      case 'paused':   return {text:'Interrotto / Pausa', icon:'schedule'};
      case 'completed':   return {text:'Completata', icon:'done'}
      case 'inprogress':  return {text:'In Lavorazione', icon:'engineering'};
      case 'toPlan':      return {text:'Da Programmare', icon: 'edit_calendar'};
      case 'enable':      return {text:'Disponibile', icon: 'verified_user'};
    }
  }

}
