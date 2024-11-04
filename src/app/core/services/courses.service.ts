import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGrade } from '../interfaces/grade.interface';
import { IResponseCurso } from '../interfaces/response.curso.inteface';


@Injectable({
  providedIn: 'root',
})
export class coursesService {
  private readonly apiUrl = '/api/cursos';

  constructor(private http: HttpClient) {}

  getCources(token:string): Observable<IResponseCurso> {
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<IResponseCurso>(this.apiUrl,{headers:reqHeader});
  }

  
}
