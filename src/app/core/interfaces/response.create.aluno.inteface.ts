import { IStudent } from "./student.interface";

export interface IResponseCreateAluno{
    "success": boolean,
    "timestamp": String,
    "message": String,
    "alunoData": IStudent[],
    "httpStatus": String
  }
  