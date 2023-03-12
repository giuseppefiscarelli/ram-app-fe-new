import { ApplicationState } from '@app/app.state';
import { User } from '@app/modules/models/user.model';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OnlyadminGuard implements CanActivate {
    userMe: User;
    user: Observable<User>;
    constructor(private router: Router,

        private store: Store<ApplicationState>,) {
            this.user = this.store.pipe(
                select('authentication'),
                select('user')
            );
            this.user.pipe(take(1)).subscribe((user: User) =>this.userMe = user);
        }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if(this.userMe.role === 'user'){
            this.router.navigate(['']);
            return false;
        }

        return true;
  }

}
