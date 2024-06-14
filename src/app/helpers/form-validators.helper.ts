import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FormValidators {
  static MatchingPasswords(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    const confirmControl = control.get('confirmPassword');
    const currentErrors = control.get('confirmPassword')?.errors;
    if (compare(password, confirmPassword)) {
      confirmControl?.setErrors({ not_match: true });
    } else {
      confirmControl?.setErrors(currentErrors ?? null);
    }
  }
}

function compare(password: string, confirmPassword: string) {
  return password !== confirmPassword && confirmPassword !== '';
}
