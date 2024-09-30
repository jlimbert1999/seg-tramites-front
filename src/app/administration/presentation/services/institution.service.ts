import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { institution } from '../../infrastructure';


@Injectable({
  providedIn: 'root',
})
export class InstitutionService {
  private readonly url = `${environment.base_url}/institutions`;
  constructor(private http: HttpClient) {}

  add(form: Object) {
    return this.http
      .post<institution>(`${this.url}`, form)
      .pipe(map((resp) => resp));
  }

  get(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{
      institutions: institution[];
      length: number;
    }>(`${this.url}`, { params });
  }

  edit(id: string, form: Object) {
    return this.http.patch<institution>(`${this.url}/${id}`, form);
  }

}
