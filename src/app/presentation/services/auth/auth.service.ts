import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  AuthStatus,
  JwtPayload,
  accountResponse,
} from '../../../infraestructure/interfaces';
import { Account } from '../../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly base_url: string = environment.base_url;
  private _account = signal<JwtPayload | null>(null);
  private _menu = signal<any[]>([]);

  public account = computed(() => this._account());
  public menu = computed(() => this._menu());

  constructor(private http: HttpClient) {}

  login(formData: { login: string; password: string }, remember: boolean) {
    remember
      ? localStorage.setItem('login', formData.login)
      : localStorage.removeItem('login');
    return this.http
      .post<{ token: string }>(`${this.base_url}/auth`, formData)
      .pipe(map(({ token }) => this.setAuthentication(token)));
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<{
        token: string;
        menu: any[];
      }>(`${this.base_url}/auth`)
      .pipe(
        map(({ menu, token }) => {
          this._menu.set(menu);
          return this.setAuthentication(token);
        }),
        catchError(() => {
          return of(false);
        })
      );
  }

  getMyAccount() {
    return this.http.get<accountResponse>(`${this.base_url}/auth/detail`).pipe(
      map((resp) => {
        resp.dependencia = resp.dependencia
          ? resp.dependencia
          : {
              _id: '',
              nombre: '',
              sigla: '',
              codigo: '',
              activo: true,
              institucion: { _id: '', nombre: '', sigla: '', activo: true },
            };
        return Account.fromJson(resp);
      })
    );
  }

  updateMyAccount(password: string) {
    return this.http.put<{ message: string }>(`${this.base_url}/auth`, {
      password,
    });
  }

  private setAuthentication(token: string): boolean {
    this._account.set(jwtDecode(token));
    localStorage.setItem('token', token);
    return true;
  }

  logout() {
    localStorage.removeItem('token');
    this._account.set(null);
  }
}
