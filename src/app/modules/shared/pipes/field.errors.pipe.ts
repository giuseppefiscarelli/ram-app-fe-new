import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AbstractControl} from '@angular/forms';

@Pipe({ name: 'errors' })
export class FieldErrorsPipe implements PipeTransform {
    constructor(private translator: TranslateService) {
    }

    transform(control: AbstractControl): string {
        if (Object.keys(control.errors).length === 0) {
            return null;
        }

        if (!!control.errors.required) {
            return this.translator.instant('errors.forms.required');
        }

        if (!!control.errors.minlength) {
            return this.translator.instant('errors.forms.minLength', { count: control.errors.minlength.requiredLength });
        }

        if (!!control.errors.maxlength) {
            return this.translator.instant('errors.forms.maxLength', { count: control.errors.maxlength.requiredLength });
        }

        const displayErrorKey = `errors.forms.${Object.keys(control.errors)[0]}`;
        const displayErrorValue = this.translator.instant(displayErrorKey);

        if (displayErrorKey !== displayErrorValue) {
            return displayErrorValue;
        } else {
            return this.translator.instant(`errors.forms.generic`);
        }
    }
}
