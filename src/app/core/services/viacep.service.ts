import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ICepAdress {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade?: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia?: string;
  ddd: string;
  siafi: string;
}

@Injectable({
  providedIn: 'root',
})
export class ViaCepService {
  private apiUrl: string = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) {}

  getAddressByCep(cep: string): Observable<ICepAdress> {
    const validCep = cep.replace(/\D/g, ''); // Remove caracteres não numéricos
    return this.http.get<ICepAdress>(`${this.apiUrl}${validCep}/json/`);
  }
}
