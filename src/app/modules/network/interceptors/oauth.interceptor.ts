import * as Moment from 'moment';
import * as ApiDefinitions from '@configs/network/api.definitions';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ApplicationState} from '@app/app.state';
import { StorageService } from '@app/modules/services/storage.service';
import { StorageKeys } from '@app/app.costants';
import { AuthenticationSignout } from '@app/modules/store/actions/authentication.actions';
import Swal from 'sweetalert2';

@Injectable()
export class OAuthInterceptor implements HttpInterceptor {
    constructor(private storage: StorageService,
                private router: Router,
                private store: Store<ApplicationState>) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.mustHandleRequest(request.url)) {
            return next.handle(request);
        }

        const currentPath = request.url;
        const currentMethod = request.method.toLowerCase();

        try {
            // We'll going to extend the request only if the route is protected as specified by the swagger
            if (ApiDefinitions.paths[currentPath][currentMethod].hasOwnProperty('security')) {
                request = request.clone({
                    setHeaders: {
                        Authorization: this.storage.get(StorageKeys.AUTH_ACCESS_TOKEN) || ''
                    }
                });
            }
        } catch (error) {
            console.error('OAuthInterceptor', 'Unable to handle outgoing request');
            console.error('OAuthInterceptor', error);
        }

        return next.handle(request).pipe(tap(
            (event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // Saving token into local storage if it is an authorization route
                    if (this.mustHandleToken(event.url, event.body)) {
                      const expirationDate = Moment.utc(event.body.auth.expiresIn).add(2, 'hours')

                      const accessToken = `${event.body.tokenType || 'JWT'} ${event.body.auth.accessToken.replace('JWT', '').trim()}`;

                      this.storage.set(StorageKeys.AUTH_ACCESS_TOKEN_EXP, expirationDate.toISOString());
                      this.storage.set(StorageKeys.AUTH_ACCESS_TOKEN, accessToken);
                    }else{

                      const tokenDate = Moment(this.storage.get(StorageKeys.AUTH_ACCESS_TOKEN_EXP))
                      const now = Moment()


                      if(tokenDate < now){

                          Swal.fire({
                              title: 'Attenzione!',
                              text: 'La sessione è scaduta',
                              icon: 'warning',
                              timer: 4000,
                              footer: 'Sarai reindirizzato alla pagina di login',
                              showCancelButton: false,
                              allowOutsideClick: false
                            }).then( (res) => {
                              this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN);
                              this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN_EXP);
                              this.storage.unset(StorageKeys.AUTH_LOGGED_USER);
                              this.store.dispatch(AuthenticationSignout());

                              this.router.navigate(['/auth/signin']);
                            });
                      }
                  }
                }
            },
            (response: any) => {
                if (response instanceof HttpErrorResponse) {
                    if ((response.status === 401 && response.error && response.error.error === 'invalid_token')) {
                        this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN);
                        this.storage.unset(StorageKeys.AUTH_ACCESS_TOKEN_EXP);
                        this.storage.unset(StorageKeys.AUTH_LOGGED_USER);
                        this.store.dispatch(AuthenticationSignout());

                        this.router.navigate(['/auth/signin']);
                    }
                }
            }
        ));
    }

    private mustHandleRequest(url): boolean {
        const urlMatchesRegex = url.match(/^\/(assets|fonts)\//);

        return !urlMatchesRegex;
    }

    private mustHandleToken(url, body): boolean {
        const urlMatchesRegex = url.match(/\/auth\/signin$/) != null;
        const hasAccessToken = urlMatchesRegex && body.auth.expiresIn != null && body.auth.accessToken != null;

        return hasAccessToken;
    }
}
