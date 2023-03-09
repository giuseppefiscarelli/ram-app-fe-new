import { TypeIstance } from './../../../models/type-istance.model';

import { IstanzeService } from './../../istanze/istanze.service';
import { ConfigService } from './../config.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
   Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class TypeIstanceResolver implements Resolve<Observable<TypeIstance>> {
    constructor(private service: ConfigService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TypeIstance> {
    const subjectIdentifier: string = route.paramMap.get('id');
    console.log(route.paramMap)
    return this.service.getTypeInstance(subjectIdentifier).pipe(
        map((subject: TypeIstance) => subject)
    );


  }
}
