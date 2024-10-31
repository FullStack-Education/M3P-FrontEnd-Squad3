import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export default class AuthTokenService {
  public getToken(): string {
    let token = localStorage.getItem('token');
    return token || '';
  }

  public decodePayloadJWT(): any {
    try {
      let jwt = jwt_decode.jwtDecode(this.getToken() || '');
      console.log(jwt)
      return jwt;
    } catch (Error) {
      return null;
    }
  }
}