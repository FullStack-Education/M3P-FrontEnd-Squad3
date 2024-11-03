import { IUsuario } from "./student.interface";


export interface IMateria {
  id:number,
  nome:string
}

export interface ITeacher {
    id: number,
    nome: string,
    dataEntrada: string,
    telefone: string,
    genero: string,
    estadoCivil: string,
    dataNascimento: string,
    email: string,
    naturalidade: string,
    cep: string,
    logradouro: string,
    numero: string,
    cidade: string,
    estado: string,
    complemento: string,
    cpf: string,
    rg: string,
    usuario:IUsuario,
    materias:IMateria[]
  
}
