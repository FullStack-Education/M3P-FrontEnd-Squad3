import { ITurma } from "./turma.inteface"

export interface Ipapel {
  "id": number,
  "nome": string
}

export interface IUsuario {
        "id": number,
        "nome": string,
        "login": string,
        "senha": string,
        "papel": Ipapel
}


export interface IStudent{
  id: number,
  nome: string,
  dataNascimento: string,
  telefone: string,
  genero: string,
  estadoCivil: string,
  email: string,
  cpf: string,
  rg: string,
  naturalidade: string,
  cep: string,
  logadouro: string,
  numero: string,
  cidade: string,
  complemento: string,
  usuario: IUsuario,
  turma:ITurma
}


