import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static password() {}

  static login(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9]+$/;
    let enteredValue = control.value;
    if (!regex.test(enteredValue)) {
      return { invalid: true };
    }
    return null;
  }
}
