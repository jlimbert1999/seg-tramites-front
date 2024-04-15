import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  accountResponse,
  communicationResponse,
  externalResponse,
  internalResponse,
  procedure,
  reportUnit,
  reportWorkAccount,
  TableProcedureData,
  typeProcedureResponse,
} from '../../../infraestructure/interfaces';
import { StatusMail } from '../../../domain/models';

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
  }: SearchApplicantProps): Observable<{
    procedures: TableProcedureData[];
    length: number;
  }> {
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
          procedures: resp.procedures.map(
            ({ details: { solicitante }, ...props }) => ({
              ...props,
              applicant: `${solicitante.nombre} ${solicitante.paterno} ${solicitante.materno}`,
            })
          ),
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

  getWorkDetails(id_account: string) {
    return this.http
      .get<reportWorkAccount[]>(`${this.url}/communication/total/${id_account}`)
      .pipe(
        map((resp) => {
          const map = {
            [StatusMail.Received]: 'RECIBIDOS',
            [StatusMail.Pending]: 'SIN RECIBIR',
            [StatusMail.Archived]: 'ARCHIVADOS',
            [StatusMail.Completed]: 'ANTENDIDOS',
            [StatusMail.Rejected]: 'RECHAZADOS',
          };
          return Object.values(StatusMail).map((status) => {
            const item = resp.find((el) => el._id === status);
            return { label: map[status], count: item ? item.count : 0 };
          });
        })
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
        _id: _id,
        group: group,
        state: state,
        reference: reference,
        startDate: startDate,
        code: code,
      })
    );
  }
}
