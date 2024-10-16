import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGrade } from '../interfaces/grade.interface';


@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private readonly apiUrl = 'http://localhost:3000/nota';

  constructor(private http: HttpClient) {}

  getGrades(): Observable<IGrade[]> {
    return this.http.get<IGrade[]>(this.apiUrl);
  }

  getGradeById(id: string): Observable<IGrade> {
    return this.http.get<IGrade>(`${this.apiUrl}/${id}`);
  }

  addGrade(grade: IGrade): Observable<IGrade> {
    return this.http.post<IGrade>(this.apiUrl, grade);
  }

  setGrade(grade: IGrade): Observable<IGrade> {
    return this.http.put<IGrade>(`${this.apiUrl}/${grade.id}`, grade);
  }

  deleteGrade(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getGradesByStudent(studentId: string): Observable<IGrade[]> {
    return this.http.get<IGrade[]>(`${this.apiUrl}?studentId=${studentId}`);
  }

  // Fetch the last 3 grades for a specific student
  getGradesByOrder(
    studentId: string,
    order: 'desc' | 'asc' = 'desc',
    limit: number = 3
  ): Observable<IGrade[]> {
    return this.http.get<IGrade[]>(
      `${this.apiUrl}?studentId=${studentId}&_sort=date&_order=${order}&_limit=${limit}`
    );
  }
}
