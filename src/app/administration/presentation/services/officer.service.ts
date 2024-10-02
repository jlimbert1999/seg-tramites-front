import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { officer, OfficerMapper } from '../../infrastructure';
import { Officer } from '../../domain';

@Injectable({
  providedIn: 'root',
})
export class OfficerService {
  private readonly url = `${environment.base_url}/officers`;

  constructor(private http: HttpClient) {}

  findAll(limit: number, offset: number, term?: string) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http
      .get<{ ok: boolean; officers: officer[]; length: number }>(
        `${this.url}`,
        { params }
      )
      .pipe(
        map(({ officers, length }) => ({
          officers: officers.map((officer) =>
            OfficerMapper.fromResponse(officer)
          ),
          length,
        }))
      );
  }

  create(form: Object): Observable<Officer> {
    return this.http
      .post<officer>(`${this.url}`, form)
      .pipe(map((resp) => OfficerMapper.fromResponse(resp)));
  }

  update(id: string, officer: Object): Observable<Officer> {
    return this.http
      .patch<officer>(`${this.url}/${id}`, officer)
      .pipe(map((resp) => OfficerMapper.fromResponse(resp)));
  }
}
