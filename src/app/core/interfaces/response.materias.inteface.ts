import { ICursoAluno } from "./curso.aluno.inteface";


export interface IMateria {
  id:number,
  nome:string
}

export interface IResponseMaterias{
    success: boolean,
    timestamp: string,
    message: string,
    materiaData: IMateria[],
    httpStatus: string
  }