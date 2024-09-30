import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { dependency, institution} from '../../infrastructure';

@Injectable({
  providedIn: 'root',
})
export class DependencyService {
  private readonly url = `${environment.base_url}/dependencies`;
  constructor(private http: HttpClient) {}

  getInstitutions() {
    return this.http.get<institution[]>(`${this.url}/institutions`);
  }

  findAll(limit: number, offset: number, term?:string) {
    const params = new HttpParams({ fromObject: { limit, offset, ...(term && { term }) } });
    return this.http.get<{
      dependencies: dependency[];
      length: number;
    }>(`${this.url}`, { params });
  }


  add(form: Object) {
    return this.http.post<dependency>(`${this.url}`, form);
  }

  edit(id: string, form: Object) {
    return this.http.patch<dependency>(`${this.url}/${id}`, form);
  }

}
