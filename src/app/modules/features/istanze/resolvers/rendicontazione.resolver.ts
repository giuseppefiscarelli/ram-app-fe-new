import { Rendicontazione } from './../../../models/istanza.model';
import { IstanzeService } from './../istanze.service';

import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendicontazioneResolver implements Resolve<Observable<Rendicontazione>> {
    constructor(private service: IstanzeService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Rendicontazione> {
    const subjectIdentifier: string = route.paramMap.get('id_ram');

    return this.service.getRendicontazione(subjectIdentifier).pipe(
        map((record: Rendicontazione) => record)
    )
  }
}
