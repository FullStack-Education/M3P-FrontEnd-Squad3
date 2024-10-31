import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import AuthTokenService from './auth-token.service';
import { IResponse } from '../interfaces/response.inteface';
import { IToken } from '../interfaces/Itoken.inteface';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiLoginUrl = '/api/login';
  private currentUserKey = 'token';

  constructor(private http: HttpClient, private authToken :AuthTokenService) { }

  signIn(email: string, password: string): Observable<IToken | null> {    
    return  this.findLogin(email, password).pipe(
        map((user: IResponse) => {
            localStorage.setItem(this.currentUserKey,user.authToken)
            return this.authToken.decodePayloadJWT();
        }),
        map((user: IToken) => user),
        catchError(() => of(null))
    );
    
  }

  private findLogin(
    email: string,
    password: string
  ): Observable<IResponse> {
    return this.http.post<IResponse>(this.apiLoginUrl,{
      'login':email,
      'senha':password
    });
  }

 


  logOut(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): IToken {
    const userJson = localStorage.getItem(this.currentUserKey);
    if (!userJson) {
      throw new Error('Error retrieving the current user details: no user found in local storage');
    }
    return this.authToken.decodePayloadJWT();
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.scope === 'ADM';
  }

  isTeacher() {
    const user = this.getCurrentUser();
    return user?.scope === "PEDAGOGICO";
  }
}