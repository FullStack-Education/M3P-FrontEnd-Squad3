import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';
import { IResponseDashBoard } from '../interfaces/response.dashboard.inteface';


@Injectable({
  providedIn: 'root',
})
export class StatiticService {
  private readonly apiUrl = '/api/dashboard';

  constructor(private http: HttpClient) {}

  getStatitics(auth_token:string): Observable<IResponseDashBoard> {
    console.log(auth_token);
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    })
    return this.http.get<IResponseDashBoard>(this.apiUrl,{ headers: reqHeader });
  }

 
}
