import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  dependencyResponse,
  institutionResponse,
} from '../../../infraestructure/interfaces';
import { DependencyDto } from '../../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class DependencyService {
  private readonly url = `${environment.base_url}/dependencies`;
  constructor(private http: HttpClient) {}

  getInstitutions() {
    return this.http
      .get<institutionResponse[]>(`${this.url}/institutions`)
      .pipe(map((resp) => resp));
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{
      dependencies: dependencyResponse[];
      length: number;
    }>(`${this.url}`, { params });
  }

  search(text: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{
      dependencies: dependencyResponse[];
      length: number;
    }>(`${this.url}/search/${text}`, {
      params,
    });
  }

  add(form: Object) {
    const dependency = DependencyDto.FormToModel(form);
    return this.http.post<dependencyResponse>(`${this.url}`, dependency);
  }

  edit(id: string, dependency: Partial<DependencyDto>) {
    return this.http.put<dependencyResponse>(`${this.url}/${id}`, dependency);
  }

  delete(id: string) {
    return this.http
      .delete<{ activo: boolean }>(`${this.url}/${id}`)
      .pipe(map((resp) => resp));
  }
}
