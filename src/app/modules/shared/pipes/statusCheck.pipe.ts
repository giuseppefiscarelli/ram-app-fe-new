import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusCheck'
})
export class StatusCheckPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!value){
        return null;
    }

    switch (value) {
        case 'toWork': return 'Da verificare';
        case 'pending': return 'In Lavorazione'
        case 'accepted': return 'Accettato';
        case 'rejected' : return 'Rigettato';
        case 'fileUpload': return 'Documento presente';
        case 'notFound': return 'Documento non presente';
    }
  }

}
