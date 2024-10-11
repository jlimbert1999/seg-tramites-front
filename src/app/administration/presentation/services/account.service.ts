import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  account,
  officer,
  dependency,
  institution,
  AccountMapper,
  OfficerMapper,
} from '../../infrastructure';
import { role } from '../../../users/infrastructure';

interface FilterAccountsParams {
  limit: number;
  offset: number;
  term?: string;
  dependency?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly url = `${environment.base_url}/accounts`;

  constructor(private http: HttpClient) {}

  getRoles() {
    return this.http.get<role[]>(`${this.url}/roles`);
  }

  getInstitutions() {
    return this.http.get<institution[]>(`${this.url}/institutions`);
  }

  getDependenciesOfInstitution(institutionId: string) {
    return this.http.get<dependency[]>(
      `${this.url}/dependencies/${institutionId}`
    );
  }

  searchOfficersWithoutAccount(term: string) {
    const params = new HttpParams({ fromObject: { term } });
    return this.http
      .get<officer[]>(`${this.url}/assign`, { params })
      .pipe(
        map((resp) =>
          resp.map((officer) => OfficerMapper.fromResponse(officer))
        )
      );
  }

  findAll({ limit, offset, term, dependency }: FilterAccountsParams) {
    const params = new HttpParams({
      fromObject: {
        limit,
        offset,
        ...(term && { term }),
        ...(dependency && { dependency }),
      },
    });
    return this.http
      .get<{ accounts: account[]; length: number }>(`${this.url}`, {
        params,
      })
      .pipe(
        map(({ accounts, length }) => ({
          accounts: accounts.map((account) =>
            AccountMapper.fromResponse(account)
          ),
          length,
        }))
      );
  }

  create(formUser: Object, formAccount: Object) {
    return this.http
      .post<account>(this.url, { user: formUser, account: formAccount })
      .pipe(map((resp) => AccountMapper.fromResponse(resp)));
  }

  edit(id: string, formUser: Record<string, any>, formAccount: Object) {
    if (formUser['password'] === '') delete formUser['password'];
    return this.http
      .patch<account>(`${this.url}/${id}`, {
        user: formUser,
        account: formAccount,
      })
      .pipe(map((resp) => AccountMapper.fromResponse(resp)));
  }

  unlink(id: string) {
    return this.http.delete<{ message: string }>(`${this.url}/unlink/${id}`);
  }

  getDetails(id_cuenta: string) {
    return this.http
      .get<{
        ok: boolean;
        details: {
          externos?: number;
          internos?: number;
          entrada?: number;
          salida?: number;
        };
      }>(`${this.url}/cuentas/details/${id_cuenta}`)
      .pipe(
        map((resp) => {
          return resp.details;
        })
      );
  }
}
