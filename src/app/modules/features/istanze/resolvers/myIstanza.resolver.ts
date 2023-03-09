import { Istanza } from './../../../models/istanza.model';
import { User } from '@app/modules/models/user.model';
import { IstanzeService } from './../istanze.service';

import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { ApplicationState } from '@app/app.state';
import { Store, select } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class MyIstanzaResolver implements Resolve<Observable<Istanza[]>> {
    user: Observable<User>;
    userMe: User;
    constructor(private service: IstanzeService,  private store: Store<ApplicationState>,) {
        this.user = this.store.pipe(select('authentication'),select('user'));
        this.user.pipe(take(1)).subscribe((userMe: User) => this.userMe = userMe);
        console.log(this.userMe, this.user)

    }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Istanza[]> {

    return this.service.fetchIstanze({term:this.userMe.email, list:true}).pipe(
        map((record: Istanza[]) => record)
    )
  }
}
