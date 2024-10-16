import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';
import { IRole } from '../interfaces/role.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUsersUrl = 'http://localhost:3000/usuario';
  private apiRolesUrl = 'http://localhost:3000/papel';
  private currentUserKey = 'currentUser';

  constructor(private http: HttpClient) {}

  signIn(username: string, password: string): Observable<IUser | null> {    
    const userWithRole = this.findUser(username, password).pipe(
      switchMap((user) => (user ? this.fetchUserRole(user) : of(null))),
      catchError((error) => {
        console.error('Error during sign-in process:', error);
        return of(null);
      })
    );
    if (userWithRole) {
      userWithRole.subscribe((user) => {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      });
    }
    return userWithRole;
  }

  private findUser(
    username: string,
    password: string
  ): Observable<IUser | null> {
    return this.http.get<IUser[]>(this.apiUsersUrl).pipe(
      map(
        (users) => {
          return users.find(
            (user) => user.name === username && user.password === password
          ) || null
        }
      ),
      catchError(() => of(null))
    );
  }

  private fetchUserRole(user: IUser): Observable<IUser> {
    return this.http.get<IRole[]>(this.apiRolesUrl).pipe(
      map((roles) => roles.find((role) => {
        console.log(role.id, user.papelId, role.id === user.papelId);
        
        return role.id === user.papelId
      })),
      map((role) => ({
        ...user,
        role: role || { id: '0', name: 'Unknown' },
      }))
    );
  }


  logOut(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): IUser {
    const userJson = localStorage.getItem(this.currentUserKey);
    if (!userJson) {
      throw new Error('Error retrieving the current user details: no user found in local storage');
    }
    return userJson ? JSON.parse(userJson) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role?.name === 'Admin';
  }

  isTeacher() {
    const user = this.getCurrentUser();
    return user?.role?.name === 'Docente';
  }
}