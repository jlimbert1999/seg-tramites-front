import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { communicationResponse } from '../../../infraestructure/interfaces';
import { Communication, StatusMail } from '../../../domain/models';

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
    console.log(text);
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
}
