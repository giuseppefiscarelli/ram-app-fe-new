import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {isExcludedFromHandling} from '@configs/network/api.exclusions';


import {ApplicationState} from '@app/app.state';
import {Store} from '@ngrx/store';
import { StorageKeys } from '@app/app.costants';
import { AuthenticationSignout } from '@app/modules/store/actions/authentication.actions';
import { StorageService } from '@app/modules/services/storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router,
                private storage: StorageService,
                private store: Store<ApplicationState>) {

    }

    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        if (isExcludedFromHandling(request.url)) {
            return handler.handle(request);
        }

        const clonedRequest = request.clone();

        return handler.handle(clonedRequest)
            .pipe(
                catchError((error: any) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 403) {
                            this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN);
                            this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN_EXP);
                            this.storage.unset(StorageKeys.AUTH_LOGGED_USER);
                            this.store.dispatch(AuthenticationSignout());

                            this.router.navigate(['/auth/signin']);
                        }

                        /*
                        else if (error.status === 404) {
                            this.router.navigate(['/errors', '404']);
                        } else if (error.status >= 500) {
                            this.router.navigate(['/errors', '500']);
                        }
                        */
                    }

                    return throwError(error);
                })
            );
    }
}
