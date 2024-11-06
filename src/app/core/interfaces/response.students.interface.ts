import { IStudent } from "./student.interface";


export interface IResponseStudents {
  "success": boolean,
  "timestamp": string,
  "message": string,
  "alunoData": IStudent[],
  "httpStatus": string
}
