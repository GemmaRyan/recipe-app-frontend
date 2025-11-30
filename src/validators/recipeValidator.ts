import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function alphanumericSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    
    const valid = /^[A-Za-z0-9\s]+$/.test(control.value);
    return valid ? null : { alphanumericSpaces: true };
  };
}

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  };
}

export function numbersSpacesDashesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    
    const valid = /^[0-9-\s]+$/.test(control.value);
    return valid ? null : { numbersSpacesDashes: true };
  };
}

export function minArrayLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const array = control.value;
    
    if (!Array.isArray(array)) {
      return null;
    }
    
    return array.length >= minLength ? null : { minArrayLength: { requiredLength: minLength, actualLength: array.length } };
  };
}

export function difficultyRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);
    
    if (isNaN(value)) {
      return null;
    }
    
    if (value < 1) {
      return { difficultyTooLow: { min: 1, actual: value } };
    }
    
    if (value > 5) {
      return { difficultyTooHigh: { max: 5, actual: value } };
    }
    
    return null;
  };
}