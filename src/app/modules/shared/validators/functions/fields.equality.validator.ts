import {FormGroup, ValidatorFn} from '@angular/forms';

export function validate(fields: string[]): ValidatorFn {
    return (group: FormGroup): { [key: string]: string } | null => {
        const values = fields.map((field: string) => group.get(field).value);
        const fieldsAreEquals = values.every((value: string) => values.filter((v: string) => v !== value).length === 0);

        if (!fieldsAreEquals) {
            fields
                .filter((field: string) => Object.keys(group.get(field).errors || {}).length === 0)
                .forEach((field: string) => group.get(field).setErrors({ notEqual: 'errors.forms.notEqual' }));
        } else {
            fields.forEach((field: string) => {
                const control = group.get(field);
                const errorsKeys = Object.keys(control.errors || {});

                const errorsObject: { [key: string]: any } = {};

                errorsKeys
                    .filter((error: string) => !!error && error !== 'notEqual')
                    .map((error: string) => errorsObject[error] = control.errors[error]);

                Object.keys(errorsObject).length === 0
                    ? group.get(field).setErrors(null)
                    : group.get(field).setErrors(errorsObject);
            });
        }

        return values.every((value: string) => values.filter((v: string) => v !== value).length === 0)
            ? null
            : { notEqual: 'errors.forms.notEqual' };
    };
}
