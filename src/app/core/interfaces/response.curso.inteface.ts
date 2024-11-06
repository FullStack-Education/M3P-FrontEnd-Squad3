import { ICursoAluno } from "./curso.aluno.inteface";

export interface IResponseCurso{
    success: boolean,
    timestamp: string,
    message: string,
    cursoData: ICursoAluno[],
    httpStatus: string
  }