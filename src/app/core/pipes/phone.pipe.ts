import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'PhonePipe',
  standalone: true
})
export class PhonePipe implements PipeTransform {

  transform(tel: string | undefined): string | undefined{
    if (!tel) return tel

    let foneFormatado = '';
    const value = tel.toString().replace(/\D/g, '');

    if (value.length > 13) {
      foneFormatado = value.replace(/(\d{3})?(\d{2})?(\d{5})?(\d{4})/, '+$1 ($2) $3-$4');

    } else if (value.length > 12) {
      foneFormatado = value.replace(/(\d{2})?(\d{2})?(\d{5})?(\d{4})/, '+$1 ($2) $3-$4');

    } else if (value.length > 11) {
      foneFormatado = value.replace(/(\d{2})?(\d{2})?(\d{4})?(\d{4})/, '+$1 ($2) $3-$4');

    } else if (value.length > 10) {
      foneFormatado = value.replace(/(\d{2})?(\d{5})?(\d{4})/, '($1) $2-$3');

    } else if (value.length > 9) {
      foneFormatado = value.replace(/(\d{2})?(\d{4})?(\d{4})/, '($1) $2-$3');

    } else if (value.length > 5) {
      foneFormatado = value.replace(/^(\d{2})?(\d{4})?(\d{0,4})/, '($1) $2-$3');

    } else if (value.length > 1) {
      foneFormatado = value.replace(/^(\d{2})?(\d{0,5})/, '($1) $2');
    } else {
      if (tel !== '') { foneFormatado = value.replace(/^(\d*)/, '($1'); }
    }

    return foneFormatado;
    
  }
}