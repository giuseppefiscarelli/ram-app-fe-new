import { TypeDocument } from './../../../models/typeDocument.model';



import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class TypeDocResolver implements Resolve<Observable<TypeDocument[]>> {
    constructor(private service: ConfigService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TypeDocument[]> {
    return this.service.fetchTypeDocuments({drop:true})
  }
}
