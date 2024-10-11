import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static password() {}

  static login(control: AbstractControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9]+$/;
    let eneteredValue = control.value;
    if (!regex.test(eneteredValue)) {
      return { invalid: true };
    }
    return null;
  }
}
