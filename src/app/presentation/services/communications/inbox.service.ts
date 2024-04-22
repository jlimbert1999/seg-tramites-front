import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  transferDetails,
  accountResponse,
  communicationResponse,
  dependencyResponse,
  institutionResponse,
  receiver,
} from '../../../infraestructure/interfaces';
import {
  Communication,
  Officer,
  StateProcedure,
  StatusMail,
} from '../../../domain/models';
import { CreateCommunicationDto } from '../../../infraestructure/dtos';

interface SearchParams {
  text: string;
  limit: number;
  offset: number;
  status?: StatusMail;
}

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  private readonly url = `${environment.base_url}/communication`;
  private http = inject(HttpClient);
  constructor() {}

  getInstitucions() {
    return this.http.get<institutionResponse[]>(`${this.url}/institutions`);
  }
  getDependenciesInInstitution(id_institution: string) {
    return this.http.get<dependencyResponse[]>(
      `${this.url}/dependencies/${id_institution}`
    );
  }
  getAccountsForSend(id_dependency: string): Observable<receiver[]> {
    return this.http
      .get<accountResponse[]>(`${this.url}/accounts/${id_dependency}`)
      .pipe(
        map((resp) =>
          resp.map(({ _id, funcionario }) => ({
            id_account: _id,
            officer: Officer.officerFromJson(funcionario!),
            online: false,
          }))
        )
      );
  }

  create(FormSend: Object, details: transferDetails, receivers: receiver[]) {
    const mail = CreateCommunicationDto.fromFormData(
      FormSend,
      details,
      receivers
    );
    return this.http.post<{ message: string }>(`${this.url}`, mail);
  }

  findAll(limit: number, offset: number, status?: StatusMail) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(status && { status }) },
    });
    return this.http
      .get<{ mails: communicationResponse[]; length: number }>(
        `${this.url}/inbox`,
        { params }
      )
      .pipe(
        map((resp) => ({
          mails: resp.mails.map((el) => Communication.fromResponse(el)),
          length: resp.length,
        }))
      );
  }
  search({ status, text, ...values }: SearchParams) {
    const params = new HttpParams({
      fromObject: { ...values, ...(status && { status }) },
    });
    return this.http
      .get<{ mails: communicationResponse[]; length: number }>(
        `${this.url}/inbox/search/${text}`,
        {
          params,
        }
      )
      .pipe(
        map((resp) => {
          return {
            mails: resp.mails.map((el) => Communication.fromResponse(el)),
            length: resp.length,
          };
        })
      );
  }
  getMail(id: string) {
    return this.http
      .get<communicationResponse>(`${this.url}/${id}`)
      .pipe(map((resp) => Communication.fromResponse(resp)));
  }

  accept(id_mail: string) {
    return this.http.put<{ message: string }>(
      `${this.url}/accept/${id_mail}`,
      null
    );
  }
  reject(id_mail: string, description: string) {
    return this.http.put<{ message: string }>(`${this.url}/reject/${id_mail}`, {
      description,
    });
  }
}
