import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  accountResponse,
  communicationResponse,
  externalResponse,
  internalResponse,
  procedure,
  reportUnit,
  TableProcedureData,
  typeProcedureResponse,
} from '../../../infraestructure/interfaces';

interface SearchApplicantProps {
  by: 'solicitante' | 'representante';
  limit: number;
  offset: number;
  form: Object;
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  url = `${environment.base_url}/reports`;

  constructor(private http: HttpClient) {}

  getTypeProceduresByText(term: string, group: 'INTERNO' | 'EXTERNO') {
    return this.http.get<typeProcedureResponse[]>(
      `${this.url}/types-procedures/${group}/${term}`
    );
  }

  searchProcedureByApplicant({
    by,
    form,
    limit,
    offset,
  }: SearchApplicantProps) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    const properties = this.removeEmptyValuesFromObject(form);
    return this.http
      .post<{ procedures: externalResponse[]; length: number }>(
        `${this.url}/applicant`,
        { by, properties },
        { params }
      )
      .pipe(
        map((resp) => ({
          procedures: this.responseToInterface(resp.procedures),
          length: resp.length,
        }))
      );
  }

  searchProcedureByProperties(limit: number, offset: number, form: Object) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    const properties = this.removeEmptyValuesFromObject(form);
    return this.http
      .post<{
        procedures: externalResponse[] | internalResponse[];
        length: number;
      }>(`${this.url}/procedure`, properties, {
        params,
      })
      .pipe(
        map((resp) => ({
          procedures: this.responseToInterface(resp.procedures),
          length: resp.length,
        }))
      );
  }

  getUnlinkAccountData() {
    return this.http
      .get<{ account: accountResponse; inbox: communicationResponse[] }>(
        `${this.url}/unlink`
      )
      .pipe(
        map((resp) => {
          return { accont: resp.account, inbox: resp.inbox };
        })
      );
  }

  getPendingsByUnit() {
    return this.http.get<reportUnit[]>(`${this.url}/unit/pendings`).pipe(
      map((resp) =>
        resp.map(({ _id: { _id, funcionario }, pendings }) => ({
          id: _id,
          officer: funcionario
            ? {
                fullname: `${funcionario.nombre} ${funcionario.nombre} ${funcionario.nombre}`,
                jobtitle: funcionario.cargo?.nombre ?? 'SIN CARGO',
              }
            : undefined,
          pendings,
        }))
      )
    );
  }

  getPendingsByAccount(id_account: string) {
    return this.http.get<communicationResponse[]>(
      `${this.url}/pending/${id_account}`
    );
  }

  private removeEmptyValuesFromObject(form: Object) {
    return Object.entries(form).reduce(
      (acc, [key, value]) => (value ? { ...acc, [key]: value } : acc),
      {}
    );
  }
  private responseToInterface(procedures: procedure[]): TableProcedureData[] {
    return procedures.map(
      ({ _id, group, reference, startDate, code, state }) => ({
        id_procedure: _id,
        group: group,
        state: state,
        reference: reference,
        date: startDate,
        code: code,
      })
    );
  }
}
