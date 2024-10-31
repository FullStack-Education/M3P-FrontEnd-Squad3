import { Injectable, Pipe, PipeTransform } from '@angular/core';
import moment, { Moment } from 'moment';

@Pipe({
  name: 'idadePipe',
  standalone: true
})
@Injectable({
  providedIn: 'root'
})
export class IdadePipe implements PipeTransform {

  transform(dataNascimentoStr: string| undefined): number | null {
    if (!dataNascimentoStr) {
      return null;
    }
    const dataNascimento = this.convertToDate(dataNascimentoStr);
    const idade = this.calculaIdade(dataNascimento);
    return idade;
  }

  private convertToDate(dataNascimentoStr: string): Moment {
    let date = moment(dataNascimentoStr,["DD/MM/YYYY", "YYYY-MM-DD"])
    return date;
  };
  
  private calculaIdade(dataNascimento: Moment): number {
    let today = moment();
    let diferenca = today.diff(dataNascimento,'years')
    return diferenca;
  };

}