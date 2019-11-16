import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserI } from '../clases/user';
import { JwtResponseI } from '../clases/jwt-response';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppGlobals } from '../app.global';
@Injectable()
export class AuthService {

  AUTH_SERVER: string
  authSubject = new BehaviorSubject(false);
  private token: string;

  constructor(private httpClient: HttpClient, public _global: AppGlobals) {
    this.AUTH_SERVER = this._global.domain
  }

  register(user: UserI): Observable<JwtResponseI> {
    return this.httpClient.post<JwtResponseI>(`${this.AUTH_SERVER}/register`,
      user).pipe(tap(
        (res: JwtResponseI) => {
          if (res) {
            // guardar token
            this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn);
          }
        })
      );
  }

  login(user: UserI): Observable<JwtResponseI> {
    return this.httpClient.post<JwtResponseI>(`${this.AUTH_SERVER}/login`,
      user).pipe(tap(
        (res: JwtResponseI) => {
          if (res) {
            this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn);
            this.saveID(res.dataUser.id, res.dataUser.name);
          }
        })
      );
  }

  GuardarEvaluacion(id_usr): Observable<JwtResponseI> {
    console.log(id_usr);
    return this.httpClient.post<JwtResponseI>(`${this.AUTH_SERVER}/setEvaluationbyobj/${id_usr}`,id_usr).pipe(tap(
        (res: JwtResponseI) => {
        })
      );
  }

  logout(): void {
    this.token = '';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
    localStorage.removeItem("ACCESS_IDS");
    localStorage.removeItem("ACCESS_name");
  }

  private saveToken(token: string, expiresIn: string): void {
    localStorage.setItem("ACCESS_TOKEN", token);
    localStorage.setItem("EXPIRES_IN", expiresIn);
    this.token = token;
  }

  private saveID(ids: string, nam: string): void {
    localStorage.setItem("ACCESS_IDS", ids);
    localStorage.setItem("ACCESS_name", nam);
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token;
  }

}
