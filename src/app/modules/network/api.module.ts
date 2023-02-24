import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {SwaggerInterceptor} from '@modules/network/interceptors/swagger.interceptor';
import {LocaleInterceptor} from '@modules/network/interceptors/locale.interceptor';
import {OAuthInterceptor} from '@modules/network/interceptors/oauth.interceptor';
import {ErrorInterceptor} from '@modules/network/interceptors/error.interceptor';

import {ApiService} from '@modules/network/api.service';

@NgModule({
    imports: [HttpClientModule],
    exports: [HttpClientModule],
    providers: [
        ApiService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: OAuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SwaggerInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LocaleInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ]
})
export class ApiModule {

}
