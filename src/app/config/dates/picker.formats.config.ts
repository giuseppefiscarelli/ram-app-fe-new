import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const PickerLocaleConfig = {
    provide: MAT_DATE_LOCALE,
    useValue: window.navigator.language
};

export const PickerFormatsConfig = {
    provide: MAT_DATE_FORMATS,
    useValue: {
        parse: {
            dateInput: ['DD/MM/YYYY'],
        },
        display: {
            dateInput: 'DD/MM/YYYY',
            monthYearLabel: 'MMM YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY',
        },
    }
};
