import { ICursoAluno } from "./curso.aluno.inteface";

export interface IResponseCursoAluno{
    success: boolean,
    timestamp: string,
    message: string,
    cursoData: ICursoAluno[],
    httpStatus: string
  }