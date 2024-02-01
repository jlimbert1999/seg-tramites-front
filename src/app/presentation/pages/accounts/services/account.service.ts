import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  accountResponse,
  dependencyResponse,
  institutionResponse,
  jobResponse,
  officerResponse,
  roleResponse,
} from '../../../../infraestructure/interfaces';
import { Account, Officer } from '../../../../domain/models';
import { AccountDto, OfficerDto } from '../../../../infraestructure/dtos';

interface SearchAccountsParams {
  text: string;
  id_dependency?: string;
  limit: number;
  offset: number;
}
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly url = `${environment.base_url}/accounts`;

  constructor(private http: HttpClient) {}

  searchJobsForOfficer(text: string) {
    return this.http.get<jobResponse[]>(`${this.url}/jobs/${text}`);
  }

  getRoles() {
    return this.http.get<roleResponse[]>(`${this.url}/roles`);
  }
  getInstitutions() {
    return this.http.get<institutionResponse[]>(`${this.url}/institutions`);
  }
  getDependenciesOfInstitution(id_institution: string, text?: string) {
    return this.http.get<dependencyResponse[]>(
      `${this.url}/dependencie/${id_institution}`,
      {
        params: text ? { text } : undefined,
      }
    );
  }

  searchOfficersWithoutAccount(text: string) {
    return this.http
      .get<officerResponse[]>(`${this.url}/assign/${text}`)
      .pipe(
        map((resp) => resp.map((officer) => Officer.officerFromJson(officer)))
      );
  }

  unlinkAccount(id: string) {
    return this.http.delete<{ message: string }>(`${this.url}/unlink/${id}`);
  }

  findAll(id_dependency: string | undefined, limit: number, offset: number) {
    return this.http
      .get<{ accounts: accountResponse[]; length: number }>(`${this.url}`, {
        params: { limit, offset, ...(id_dependency && { id_dependency }) },
      })
      .pipe(
        map((resp) => {
          return {
            accounts: resp.accounts.map((account) => Account.fromJson(account)),
            length: resp.length,
          };
        })
      );
  }

  search({ id_dependency, text, ...values }: SearchAccountsParams) {
    const params = new HttpParams({
      fromObject: {
        ...values,
        ...(id_dependency && { id_dependency }),
        ...(text && { text }),
      },
    });
    return this.http
      .get<{ accounts: accountResponse[]; length: number }>(
        `${this.url}/search`,
        {
          params,
        }
      )
      .pipe(
        map((resp) => {
          return {
            accounts: resp.accounts.map((account) => Account.fromJson(account)),
            length: resp.length,
          };
        })
      );
  }

  add(formAccount: Object, formOfficer: Object) {
    const account = AccountDto.FormtoModel(formAccount);
    const officer = OfficerDto.FormtoModel(formOfficer);
    return this.http
      .post<accountResponse>(`${this.url}`, { officer, account })
      .pipe(map((resp) => Account.fromJson(resp)));
  }

  assign(form: Object) {
    const account = AccountDto.FormtoModel(form);
    return this.http
      .post<accountResponse>(`${this.url}/assign`, account)
      .pipe(map((resp) => Account.fromJson(resp)));
  }

  edit(id: string, account: Object) {
    return this.http
      .put<accountResponse>(`${this.url}/${id}`, account)
      .pipe(map((resp) => Account.fromJson(resp)));
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
