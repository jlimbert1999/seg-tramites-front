import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GroupedCommunication } from '../../../domain/models';
import { groupedCommunicationResponse } from '../../../infraestructure/interfaces';
import { communication } from '../../../communications/infrastructure';

@Injectable({
  providedIn: 'root',
})
export class OutboxService {
  private readonly url = `${environment.base_url}/communication`;
  constructor(private http: HttpClient) {}

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ mails: communication[]; length: number }>(
      `${this.url}/outbox`,
      {
        params,
      }
    );
  }
  cancelMails(id_procedure: string, ids: string[]) {
    return this.http.delete<{ message: string }>(
      `${this.url}/outbox/${id_procedure}`,
      { body: { ids_mails: ids } }
    );
  }

  search(limit: number, offset: number, term: string) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ mails: groupedCommunicationResponse[]; length: number }>(
        `${this.url}/outbox/search/${term}`,
        { params }
      )
      .pipe(
        map((resp) => ({
          mails: resp.mails.map((el) =>
            GroupedCommunication.responseToModel(el)
          ),
          length: resp.length,
        }))
      );
  }
}
