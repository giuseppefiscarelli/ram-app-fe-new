import {ModuleWithProviders, NgModule} from '@angular/core';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

import {TranslationsLoader} from './translations.loader';

export function StaticLoaderFactory(): TranslateLoader {
    return new TranslationsLoader();
}

@NgModule({

})
export class TranslationsModule {
    static forRoot(): ModuleWithProviders<TranslateModule> {
        return TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: StaticLoaderFactory
            }
        });
    }

    static forChild(): ModuleWithProviders<TranslateModule> {
        return TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: StaticLoaderFactory
            }
        });
    }
}
