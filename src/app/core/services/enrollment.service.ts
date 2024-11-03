import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ICourse } from '../interfaces/course.interface';
import { IResponseTurma } from '../interfaces/response.turma.inteface';
import { IResponseMaterias } from '../interfaces/response.materias.inteface';

export interface IEnrollmentClass {
  id: string;
  name: string;
  teacherId: string; 
  studentIds?: string[]; 
  subjectId?: string;
  courseId: string;
  courseName: string;
}
export interface IDisciplines{
  id: string;
  name: string;
}


@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:3000/turma';
  private apiUrlApi = '/api/turmas';
  private disciplinesApiUrl = 'http://localhost:3000/materia';
  private ApiUrldisciplines = '/api/materias';
  private coursesApiUrl = 'http://localhost:3000/curso';
  
  constructor(private http: HttpClient) {}

  getEnrollments(): Observable<IEnrollmentClass[]> {
    return this.http.get<IEnrollmentClass[]>(this.apiUrl);
  }

  getEnrollmentsToken(token:string): Observable<IResponseTurma> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IResponseTurma>(this.apiUrlApi,{headers:reqHeader});
  }

  getEnrollmentById(id: string): Observable<IEnrollmentClass> {
    return this.http.get<IEnrollmentClass>(`${this.apiUrl}/${id}`);
  }

  addEnrollment(newClass: IEnrollmentClass): Observable<IEnrollmentClass> {
    return this.http.post<IEnrollmentClass>(this.apiUrl, newClass);
  }
  
  setEnrollment(enrollment: IEnrollmentClass): Observable<IEnrollmentClass> {
    return this.http.put<IEnrollmentClass>(
      `${this.apiUrl}/${enrollment.id}`,
      enrollment
    );
  }

  deleteEnrollment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEnrollmentCount(): Observable<number> {
    return this.http
      .get<IEnrollmentClass[]>(this.apiUrl)
      .pipe(map((classes) => classes.length));
  }

  getDisciplines(): Observable<IDisciplines[]> {
    return this.http.get<IDisciplines[]>(this.disciplinesApiUrl);
  }
  
  getDisciplinesToken(token:string): Observable<IResponseMaterias> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IResponseMaterias>(this.ApiUrldisciplines,{headers:reqHeader});
  }

  getDisciplineById(id: string): Observable<IDisciplines> {
    return this.http.get<IDisciplines>(`${this.disciplinesApiUrl}/${id}`);
  }

  getEnrollmentsByStudentId(studentId: string): Observable<IEnrollmentClass[]> {
    return this.http.get<IEnrollmentClass[]>(this.apiUrl).pipe(
      map((classes) => {
        return classes.filter((enrollment) => {
          console.log('again', enrollment.studentIds, "studentId:", studentId, typeof studentId);
          
          const response = enrollment.studentIds?.includes(studentId);
          console.log('response:', response);
          
          return response;
        });
      })
    );
  }
  getCourses(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(this.coursesApiUrl);
  }

  getCourseNameById(courseId: string): Observable<string> {
    return this.getCourses().pipe(
      map((courses) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.name : 'Curso Desconhecido';
      })
    );
  }
}
