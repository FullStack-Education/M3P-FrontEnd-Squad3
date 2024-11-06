import { ITurma } from "./turma.inteface";



export interface IResponseTurma{
    success: boolean,
    timestamp: string,
    message: string,
    turmaData: ITurma[],
    httpStatus: string
  }