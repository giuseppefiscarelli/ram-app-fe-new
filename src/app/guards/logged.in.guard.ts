import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import { StorageService } from '@app/modules/services/storage.service';
import { StorageKeys } from '@app/app.costants';


@Injectable()
export class LoggedInGuard implements CanActivate{
    constructor(private storage: StorageService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const hasAccessToken: boolean = !!this.storage.get(StorageKeys.AUTH_ACCESS_TOKEN);
        const hasUserInstance: boolean = !!this.storage.get(StorageKeys.AUTH_LOGGED_USER);

        if (hasAccessToken && hasUserInstance) {
            return true;
        }

        this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN);
        this.storage.unset(StorageKeys.AUTH_LOGGED_USER);

        return this.router.parseUrl('/auth/signin');
    }
}
