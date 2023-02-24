import {TranslateLoader} from '@ngx-translate/core';
import {of} from 'rxjs';

import {TranslationDefinitions} from '@modules/translations/translations.config';

export class TranslationsLoader implements TranslateLoader {
    public getTranslation(language: string): any {
        let translation = TranslationDefinitions[language];

        if (!translation) {
            translation = TranslationDefinitions[language.substr(0, 2)];
        }

        if (!translation) {
            console.warn(`No language definition found for ${language}, falling back to italian.`);

            translation = TranslationDefinitions.it;
        }

        return of(translation);
    }
}
