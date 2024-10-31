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

export interface IStudentEnrollment extends IEnrollmentClass {
  materiaName: string
}

export interface IStudentGrade extends IGrade {
  materiaName: string;
  professorName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private readonly apiUrl = '/api/alunos';

  private readonly studentRoleId = "3";

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private enrollmentService: EnrollmentService,
    private gradeService: GradeService
  ) { }

  getStudentsToken(token?: string): Observable<IResponseStudents> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    return this.http.get<IResponseStudents>(this.apiUrl, { headers: reqHeader });
  }


  getStudents(): Observable<IUser[]> {
    return this.userService.getUsersByRole(this.studentRoleId);
  }

  getStudentById(id: string): Observable<IUser> {
    return this.userService.getUserById(id).pipe(
      filter((user) => user.papelId === this.studentRoleId),
      map((user) => user)
    );
  }

  getNotasAlunoToken(studentId: string, token: string): Observable<IResponseNotaAluno> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IResponseNotaAluno>(`${this.apiUrl}/${studentId}/notas`, { headers: reqHeader });
  }

  getCursoAlunoToken(studentId: string, token: string): Observable<IResponseCursoAluno> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IResponseCursoAluno>(`${this.apiUrl}/${studentId}/meu-curso`, { headers: reqHeader });
  }

  getEnrollments(studentId: string): Observable<IEnrollmentClass[]> {
    const response =
      this.enrollmentService.getEnrollmentsByStudentId(studentId);
    console.log('getEnrollments', response);

    return response;
  }


  getGrades(studentId: string): Observable<IStudentGrade[]> {
    return this.gradeService
      .getGradesByStudent(studentId)
      .pipe(mergeMap((grades) => this.addDisciplineNames(grades)));
  }

  private addDisciplineNames(grades: IGrade[]): Observable<IStudentGrade[]> {
    return this.enrollmentService
      .getDisciplines()
      .pipe(
        map((disciplines) =>
          grades.map((grade) => this.mapGradeToDiscipline(grade, disciplines))
        )
      );
  }

  private mapGradeToDiscipline(
    grade: IGrade,
    disciplines: IDisciplines[]
  ): IStudentGrade {
    const discipline = disciplines.find((d) => {
      console.log(d.id == grade.materiaId, d.id, grade.materiaId);

      return d.id == grade.materiaId;
    });
    return {
      ...grade,
      materiaName: discipline?.name || 'Unknown',
    };
  }

  getGradesByOrder(
    studentId: string,
    order: 'desc' | 'asc' = 'desc',
    limit: number = 3
  ): Observable<IStudentGrade[]> {
    return this.gradeService
      .getGradesByOrder(studentId, order, limit)
      .pipe(mergeMap((grades) => this.addDisciplineNames(grades)));
  }

  addStudent(student: IUser): Observable<IUser> {
    student.papelId = this.studentRoleId; // Ensure the role is set to Student
    return this.userService.addUser(student);
  }

  setStudent(student: IUser): Observable<IUser> {
    if (student.papelId !== this.studentRoleId) {
      throw new Error('Invalid role for student');
    }
    return this.userService.setUser(student);
  }

  deleteStudent(id: string): Observable<void> {
    return this.userService.deleteUser(id);
  }

  getStudentCount(): Observable<number> {
    return this.getStudents().pipe(map((students) => students.length));
  }
}
