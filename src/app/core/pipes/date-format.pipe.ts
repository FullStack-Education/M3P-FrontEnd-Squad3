import { Pipe, PipeTransform } from '@angular/core';
import moment, { Moment } from 'moment';

@Pipe({
  name: 'dateFormatPipe',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  transform(dataNascimentoStr: string | undefined): any {
    if (!dataNascimentoStr) {
      return null;
    }
    const dataNascimento = this.convertToDate(dataNascimentoStr);

    return dataNascimento.format("DD/MM/YYYY");
  }

  private convertToDate(dataNascimentoStr: string): Moment {
    let date = moment(dataNascimentoStr,["DD/MM/YYYY", "YYYY-MM-DD"])
    console.log(dataNascimentoStr,date,!date.isValid())
    return date;
  };
  
  

}