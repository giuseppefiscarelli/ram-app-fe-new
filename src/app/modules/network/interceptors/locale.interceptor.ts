import {HttpEvent, HttpInterceptor, HttpHandler, HttpHeaders, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';

export class LocaleInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
        let modifiedRequest: HttpRequest<any>;
        let language = window.navigator.language;

        language = language.length > 2 ? language.substr(0, 2) : language;

        modifiedRequest = request.clone({
            setHeaders: {
                'Accept-Language': language
            }
        });

        return handler.handle(modifiedRequest);
    }
}
