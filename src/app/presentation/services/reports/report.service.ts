import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  accountResponse,
  communicationResponse,
  externalResponse,
  internalResponse,
  reportProcedureData,
  typeProcedureResponse,
} from '../../../infraestructure/interfaces';

interface SearchApplicantProps {
  limit: number;
  offset: number;
  type: 'solicitante' | 'representante';
  form: Object;
}
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  url = `${environment.base_url}/reports`;

  constructor(private http: HttpClient) {}

  searchTypeProceduresByText(text: string) {
    return this.http.get<typeProcedureResponse[]>(
      `${this.url}/types-procedures/${text}`
    );
  }

  searchProcedureByApplicant({
    limit,
    offset,
    type,
    form,
  }: SearchApplicantProps) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    const fields = this.removeEmptyValuesFromObject(form);
    return this.http
      .post<{ procedures: externalResponse[]; length: number }>(
        `${this.url}/applicant/${type}`,
        fields,
        { params }
      )
      .pipe(
        map((resp) => {
          const data: reportProcedureData[] = resp.procedures.map(
            ({ details: { solicitante }, ...values }) => {
              return {
                id_procedure: values._id,
                group: values.group,
                code: values.code,
                reference: values.reference,
                state: values.state,
                date: values.startDate,
                applicant: [
                  solicitante.nombre,
                  solicitante.paterno,
                  solicitante.materno,
                ]
                  .filter(Boolean)
                  .join(' '),
              };
            }
          );
          return { procedures: data, length: resp.length };
        })
      );
  }

  searchProcedureByProperties(limit: number, offset: number, form: Object) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .post<{
        procedures: externalResponse[] | internalResponse[];
        length: number;
      }>(`${this.url}/procedure`, this.removeEmptyValuesFromObject(form), {
        params,
      })
      .pipe(
        map((resp) => {
          const data: reportProcedureData[] = resp.procedures.map((el) => ({
            id_procedure: el._id,
            date: el.startDate,
            reference: el.reference,
            state: el.state,
            group: el.group,
            code: el.code,
          }));
          return { procedures: data, length: resp.length };
        })
      );
  }

  getUnlinkAccountData() {
    return this.http
      .get<{ account: accountResponse; inbox: communicationResponse[] }>(
        `${this.url}/pendings`
      )
      .pipe(
        map((resp) => {
          return { accont: resp.account, inbox: resp.inbox };
        })
      );
  }

  private removeEmptyValuesFromObject(form: Object) {
    return Object.entries(form).reduce(
      (acc, [key, value]) => (value ? { ...acc, [key]: value } : acc),
      {}
    );
  }
}
