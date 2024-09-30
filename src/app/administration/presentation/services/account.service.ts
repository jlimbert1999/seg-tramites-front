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
  getDependenciesOfInstitution(id_institution: string, text?: string) {
    return this.http.get<dependency[]>(
      `${this.url}/dependencie/${id_institution}`,
      {
        params: text ? { text } : undefined,
      }
    );
  }

  searchOfficersWithoutAccount(text: string) {
    return this.http
      .get<officer[]>(`${this.url}/assign/${text}`)
      .pipe(
        map((resp) =>
          resp.map((officer) => OfficerMapper.fromResponse(officer))
        )
      );
  }

  unlink(id: string) {
    return this.http.delete<{ message: string }>(`${this.url}/unlink/${id}`);
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

  create(formAccount: Object, formOfficer: Object) {
    // const account = AccountDto.toModel(formAccount);
    // const officer = OfficerDto.toModel(formOfficer);
    return this.http
      .post<account>(`${this.url}`, { formAccount, formOfficer })
      .pipe(map((resp) => AccountMapper.fromResponse(resp)));
  }

  assign(form: Object) {
    // const account = AccountDto.toModel(form);
    return this.http
      .post<account>(`${this.url}/assign`, form)
      .pipe(map((resp) => AccountMapper.fromResponse(resp)));
  }

  edit(id: string, account: Object) {
    return this.http
      .put<account>(`${this.url}/${id}`, account)
      .pipe(map((resp) => AccountMapper.fromResponse(resp)));
  }

  disable(id: string) {
    return this.http.delete<boolean>(`${this.url}/${id}`);
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
  toggleVisibility(id: string) {
    return this.http.put<boolean>(`${this.url}/visibility/${id}`, undefined);
  }
}
