import { ICursoAluno } from "./curso.aluno.inteface";

export interface INota {
  "id": number,
  "aluno": {
    "id": number,
  }
  "materia": {
    "id": number,
  }
  "turma": {
    "id": number,
  },
  "nome": string,
  "valor": number,
  "data": string
}

export interface IResponseNota {
  success: boolean,
  timestamp: string,
  message: string,
  notaData: INota[],
  httpStatus: string
}