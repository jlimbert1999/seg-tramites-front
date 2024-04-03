import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  jobResponse,
  officerResponse,
  workHistoryResponse,
} from '../../../infraestructure/interfaces';
import { Officer } from '../../../domain/models';
import { OfficerDto } from '../../../infraestructure/dtos';

@Injectable({
  providedIn: 'root',
})
export class OfficerService {
  private readonly url = `${environment.base_url}/officers`;

  constructor(private http: HttpClient) {}
  searchJobs(term: string) {
    return this.http.get<jobResponse[]>(`${this.url}/jobs/${term}`);
  }

  search(text: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ officers: officerResponse[]; length: number }>(
        `${this.url}/search/${text}`,
        { params }
      )
      .pipe(
        map((resp) => {
          return {
            officers: resp.officers.map((officer) =>
              Officer.officerFromJson(officer)
            ),
            length: resp.length,
          };
        })
      );
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ ok: boolean; officers: officerResponse[]; length: number }>(
        `${this.url}`,
        { params }
      )
      .pipe(
        map((resp) => {
          return {
            officers: resp.officers.map((officer) =>
              Officer.officerFromJson(officer)
            ),
            length: resp.length,
          };
        })
      );
  }
  add(officer: Object): Observable<Officer> {
    const officerDto = OfficerDto.toModel(officer);
    return this.http
      .post<officerResponse>(`${this.url}`, officerDto)
      .pipe(map((resp) => Officer.officerFromJson(resp)));
  }

  edit(id: string, officer: Partial<Officer>): Observable<Officer> {
    return this.http
      .put<officerResponse>(`${this.url}/${id}`, officer)
      .pipe(map((resp) => Officer.officerFromJson(resp)));
  }

  delete(id: string) {
    return this.http.delete<{ activo: boolean }>(`${this.url}/${id}`);
  }

  removeJob(id: string) {
    return this.http.put<{ message: string }>(
      `${this.url}/unlink/${id}`,
      undefined
    );
  }
  getWorkHistory(id_officer: string, offset: number) {
    const params = new HttpParams().set('offset', offset);
    return this.http
      .get<workHistoryResponse[]>(`${this.url}/history/${id_officer}`, {
        params,
      })
      .pipe(map((resp) => resp));
  }
}
