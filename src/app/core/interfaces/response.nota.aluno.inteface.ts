import { INota } from "./nota.inteface";

export interface IResponseNotaAluno{
    success: boolean,
    timestamp: string,
    message: string,
    notaData: INota[],
    httpStatus: string
  }