import {
    AbstractControl,
    ValidationErrors,
    ValidatorFn
} from '@angular/forms';

export function noConsecutiveSpacesValidator(): ValidatorFn {

    return (
        control: AbstractControl
    ): ValidationErrors | null => {

        const value =
            control.value;

        if (
            !value
        ) {

            return null;
        }

        if (
            value.includes('  ')
        ) {

            return {
                consecutiveSpaces: true
            };
        }

        return null;
    };
}