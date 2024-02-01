import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { InstitutionDto } from '../../../../infraestructure/dtos';
import { institutionResponse } from '../../../../infraestructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private readonly url = `${environment.base_url}/institutions`;
  constructor(private http: HttpClient) {}

  add(institucion: InstitutionDto) {
    return this.http
      .post<institutionResponse>(`${this.url}`, institucion)
      .pipe(map((resp) => resp));
  }

  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{
      institutions: institutionResponse[];
      length: number;
    }>(`${this.url}/search/${term}`, {
      params,
    });
  }

  get(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{
      institutions: institutionResponse[];
      length: number;
    }>(`${this.url}`, { params });
  }

  edit(id: string, institucion: Partial<institutionResponse>) {
    return this.http.put<institutionResponse>(`${this.url}/${id}`, institucion);
  }

  delete(id: string) {
    return this.http.delete<{ activo: boolean }>(`${this.url}/${id}`);
  }
}
