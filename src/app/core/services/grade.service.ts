import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGrade } from '../interfaces/grade.interface';


@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private readonly apiUrl = 'http://localhost:3000/nota';
  private readonly apiUrlApi = '/api/notas';

  constructor(private http: HttpClient) {}


  
  getGradeByIdToken(id:number,token:string): Observable<IGrade[]> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IGrade[]>(`${this.apiUrlApi}/${id}`, {headers:reqHeader});
  }

  addGradeToken(body:any,token:string): Observable<IGrade[]> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<IGrade[]>(`${this.apiUrlApi}`,body, {headers:reqHeader});
  }

  setGradeToken(id:number,body:any,token:string): Observable<IGrade[]> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.put<IGrade[]>(`${this.apiUrlApi}/${id}`,body, {headers:reqHeader});
  }

  deleteGradeToken(id: number,token:string): Observable<void> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {headers:reqHeader});
  }

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
