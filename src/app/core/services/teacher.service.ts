import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { EnrollmentService, IEnrollmentClass, IDisciplines } from './enrollment.service';
import { GradeService } from './grade.service';
import { IUser } from '../interfaces/user.interface';
import { IGrade } from '../interfaces/grade.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResponseStudents } from '../interfaces/response.students.interface';
import { IResponseNotaAluno } from '../interfaces/response.nota.aluno.inteface';
import { IResponseCursoAluno } from '../interfaces/response.curso.aluno.inteface';
import { IRequestCreateAluno } from '../interfaces/request.create.aluno.inteface';
import { IResponseTeachers } from '../interfaces/response.teacher.interface';
import { IRequestCreateTeacher } from '../interfaces/request.create.teacher.inteface';


@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private readonly apiUrl = '/api/docentes';

    constructor(
    private http: HttpClient,
  ) { }

  getAllTeachersToken(token?: string): Observable<IResponseTeachers> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get<IResponseTeachers>(this.apiUrl, { headers: reqHeader });
  }


  getTeacherByIdToken(id:number,token?: string): Observable<IResponseTeachers> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get<IResponseTeachers>(`${this.apiUrl}/${id}`, { headers: reqHeader });
  }

  getUpdateTeachersToken(id:number,body:any,token?: string): Observable<IResponseTeachers> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.put<IResponseTeachers>(`${this.apiUrl}/${id}`, body,{ headers: reqHeader });
  }


  getCreateTeachersToken(body:any,token?: string): Observable<IResponseTeachers> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.post<IResponseTeachers>(this.apiUrl, body,{ headers: reqHeader });
  }

  getTeacherToken(id:number ,token?: string): Observable<IResponseTeachers> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get<IResponseTeachers>(`${this.apiUrl}/${id}`, { headers: reqHeader });
  }


  getDeleteTeacherToken(id:number ,token?: string): Observable<IResponseTeachers> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.delete<IResponseTeachers>(`${this.apiUrl}/${id}`, { headers: reqHeader });
  }
  
}
