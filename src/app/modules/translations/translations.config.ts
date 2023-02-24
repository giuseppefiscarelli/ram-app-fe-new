import * as BrowserLocale from 'browser-locale';

import {LanguageDefinition as ItalianLanguageDefinition} from '@configs/translations/it';
import {LanguageDefinition as EnglishLanguageDefinition} from '@configs/translations/en';
const TranslationDefinitions = {
    it: ItalianLanguageDefinition,
    en: EnglishLanguageDefinition

};

const currentBrowserLanguage = (): string => {
  console.log(BrowserLocale())
 // return('en-EN')
    return BrowserLocale();
};

export {
    TranslationDefinitions,
    currentBrowserLanguage
};
