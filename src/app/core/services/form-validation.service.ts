import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }

  public getInputErrorMessage(formGroup: FormGroup, inputName: string) {
    const errors = formGroup.get(inputName)?.errors;

    if (!errors) return;
    if (errors['required']) return 'Campo obrigatório!';
    if (errors['minlength']) {
      let err = errors['minlength']
      return 'Este campo deve conter pelo menos ' + err['requiredLength'] + ' caracteres!';
    }
    if (errors['maxlength']) {
      let err = errors['maxlength']
      return 'Este campo não pode ultrapassar ' + err['requiredLength'] + ' caracteres!';
    }
    if (errors['length']) {
      let err = errors['length']
      return 'Este campo deve conter '+ err +' caracteres!';
    }
    if (errors['numberLength']) {
      let err = errors['numberLength']
      return 'Este campo deve conter '+ err +' dígitos!';
    }
    if (errors['max']) {
      let err = errors['max']
      return 'Este campo não pode conter o valor superior  a ' + err['max'] + '!';
    }
    if (errors['min']) {
      let err = errors['min']
      return 'Este campo não pode conter o valor  inferior a ' + err['min'] + '!';
    }
    if (errors['mail']) {
      return 'Utilize um e-mail válido!';
    }
    if (errors['pattern']) {
      return "Utilize um valor valido solicitado pelo campo"
    }

    return 'Campo Inválido';
  };


  public inputHasError(formGroup: FormGroup, inputName: string): boolean {
    const inputControl = formGroup.controls[inputName];

    return (inputControl.dirty || inputControl.touched) && inputControl.invalid;
  }

  public requireLength(length: number) {
    return (control: FormControl) => {
      if (!control.value) return;
      if (control.value.length != length)
        return { length: length };
      return;
    }
  }

  public requireNumberLength(length: number) {
    return (control: FormControl) => {
      const value: string = control.value;
      if (!value) return;
      if (value.replaceAll(/\D/g, '').length != length)
        return { numberLength: length };
      return;
    }
  }
}
