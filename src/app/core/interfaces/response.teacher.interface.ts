import { ITeacher } from "./teacher.interface";


export interface IResponseTeachers {
  success: boolean,
  timestamp: string,
  message: string,
  docenteData: ITeacher[],
  httpStatus: string
}
