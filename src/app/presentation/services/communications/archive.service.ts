import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Communication, StateProcedure } from '../../../domain/models';
import { communicationResponse } from '../../../infraestructure/interfaces';

interface ArchiveDetail {
  description: string;
  state: StateProcedure.Concluido | StateProcedure.Suspendido;
}
@Injectable({
  providedIn: 'root',
})
export class ArchiveService {
  private readonly url = `${environment.base_url}/archives`;
  private http = inject(HttpClient);

  constructor() {}

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ archives: communicationResponse[]; length: number }>(
        `${this.url}`,
        { params }
      )
      .pipe(
        map((resp) => ({
          mails: resp.archives.map((el) => Communication.fromResponse(el)),
          length: resp.length,
        }))
      );
  }

  search(text: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ archives: communicationResponse[]; length: number }>(
        `${this.url}/search/${text}`,
        { params }
      )
      .pipe(
        map((resp) => ({
          mails: resp.archives.map((el) => Communication.fromResponse(el)),
          length: resp.length,
        }))
      );
  }

  archiveCommunication(id: string, detail: ArchiveDetail) {
    return this.http.post<{ message: string }>(
      `${this.url}/mail/${id}`,
      detail
    );
  }
  
  unarchiveCommunication(id: string) {
    return this.http.post<{ message: string }>(
      `${this.url}/mail/restore/${id}`,
      undefined
    );
  }
}
