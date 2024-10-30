import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export default class AuthTokenService {
  public getToken(): string|null {
    return localStorage.getItem('token');
  }

  public decodePayloadJWT(): any {
    try {
      return jwt_decode.jwtDecode(this.getToken() || '');
    } catch (Error) {
      return null;
    }
  }
}