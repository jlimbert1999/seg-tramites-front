import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  JwtPayload,
  VALID_RESOURCES,
  accountResponse,
  menu,
} from '../../../infraestructure/interfaces';
import { Account } from '../../../domain/models';

interface loginProps {
  login: string;
  password: string;
  remember: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly base_url: string = environment.base_url;
  private _account = signal<JwtPayload | null>(null);
  private _menu = signal<menu[]>([]);
  private _code = signal<string>('');
  private _permissions = signal<Record<VALID_RESOURCES, string[]> | null>(null);
  private _updatedPassword = signal<boolean>(false);

  public account = computed(() => this._account());
  public menu = computed(() => this._menu());
  public code = computed(() => this._code());
  public permissions = computed(() => this._permissions()!);
  public updatedPassword = computed(() => this._updatedPassword());

  constructor(private http: HttpClient) {}

  login({ login, password, remember }: loginProps) {
    if (remember) {
      localStorage.setItem('login', login);
    } else {
      localStorage.removeItem('login');
    }
    return this.http
      .post<{ token: string; url: string }>(`${this.base_url}/auth`, {
        login,
        password,
      })
      .pipe(
        map(({ token, url }) => {
          this._setAuthentication(token);
          return url;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this._account.set(null);
    this._permissions.set(null);
  }

  checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.http
      .get<{
        token: string;
        code: string;
        menu: menu[];
        permissions: Record<VALID_RESOURCES, string[]>;
        updatedPassword: boolean;
      }>(`${this.base_url}/auth`)
      .pipe(
        map(({ menu, token, code, permissions, updatedPassword }) => {
          this._menu.set(menu);
          this._code.set(code);
          this._permissions.set(permissions);
          this._updatedPassword.set(updatedPassword);
          return this._setAuthentication(token);
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
    return this.http
      .put<{ message: string }>(`${this.base_url}/auth`, {
        password,
      })
      .pipe(tap(() => this._updatedPassword.set(true)));
  }

  private _setAuthentication(token: string): boolean {
    this._account.set(jwtDecode(token));
    localStorage.setItem('token', token);
    return true;
  }
}
