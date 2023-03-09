import { StorageService } from '@app/modules/services/storage.service';
import { User } from '@app/modules/models/user.model';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ApplicationState } from '@app/app.state';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DirectaccessGuard implements CanActivate {
    menu: User;
    user: Observable<User>;
    constructor(private router: Router,
                private storage: StorageService,
                private store: Store<ApplicationState>,) {
                    this.user = this.store.pipe(
                        select('authentication'),
                        select('user')
                    );
                    this.user.pipe(take(1)).subscribe((user: User) =>this.menu = user);
                }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (this.router.url === '/') {

            this.router.navigate(['']);
            return false;
        }
        return true;
      }
    }
