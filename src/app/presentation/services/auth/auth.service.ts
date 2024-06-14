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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly base_url: string = environment.base_url;
  private _account = signal<JwtPayload | null>(null);
  private _menu = signal<menu[]>([]);
  private _code = signal<string>('');
  private _permissions = signal<Record<VALID_RESOURCES, string[]> | null>(null);

  public account = computed(() => this._account());
  public menu = computed(() => this._menu());
  public code = computed(() => this._code());
  public permissions = computed(() => this._permissions()!);

  constructor(private http: HttpClient) {}

  login(formData: { login: string; password: string }, remember: boolean) {
    remember
      ? localStorage.setItem('login', formData.login)
      : localStorage.removeItem('login');
    return this.http
      .post<{ token: string }>(`${this.base_url}/auth`, formData)
      .pipe(map(({ token }) => this._setAuthentication(token)));
  }

  logout() {
    localStorage.removeItem('token');
    this._account.set(null);
    this._permissions.set(null);
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
        code: string;
        menu: menu[];
        permissions: Record<VALID_RESOURCES, string[]>;
      }>(`${this.base_url}/auth`)
      .pipe(
        map(({ menu, token, code, permissions }) => {
          this._menu.set(menu);
          this._code.set(code);
          this._permissions.set(permissions);
          return this._setAuthentication(token);
        }),
        catchError(() => {
          return of(false);
        })
      );
  }

  checkUpdatedPasswrod(): Observable<boolean> {
    return this.http.get<boolean>(`${this.base_url}/auth/security`).pipe(
      tap((isUpdated) => {
        if (isUpdated) {
          localStorage.setItem('updated', '1');
        }
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

  private _setAuthentication(token: string): boolean {
    this._account.set(jwtDecode(token));
    localStorage.setItem('token', token);
    return true;
  }
}
