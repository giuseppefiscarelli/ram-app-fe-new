import { IstanzaCheck } from './../../../models/istanzacheck.model';
import { IstanzeService } from './../istanze.service';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
  })

  export class IstanzaCheckResolver implements Resolve <Observable<IstanzaCheck>>{
    constructor(private service: IstanzeService){

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IstanzaCheck>{
        const subjectIdentifier: string = route.paramMap.get('id_ram');
      //  console.log(route)
        return this.service.getIstanzaCheck(subjectIdentifier).pipe(
            map((record: IstanzaCheck) => record)
        )
    }
  }
