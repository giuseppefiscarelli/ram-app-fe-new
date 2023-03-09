import { Istanza } from './../../../models/istanza.model';
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
export class IstanzaResolver implements Resolve<Observable<Istanza>> {
    constructor(private service: IstanzeService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Istanza> {
    const subjectIdentifier = `${route.paramMap.get('id_ram')}`;
    //console.log(route.paramMap.get('id_ram'))
    return this.service.getIstanza(subjectIdentifier).pipe(
        map((record: Istanza) => record)
    )
  }
}
