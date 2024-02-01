import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { jobResponse } from '../../../../infraestructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly url = `${environment.base_url}/jobs`;
  constructor(private http: HttpClient) {}

  searchJobForOfficer(text: string) {
    return this.http
      .get<jobResponse[]>(`${this.url}/search/job/officer/${text}`)
      .pipe(map((resp) => resp));
  }

  searchSuperior(text: string) {
    return this.http
      .get<jobResponse[]>(`${this.url}/search/dependents/${text}`)
      .pipe(map((resp) => resp));
  }
  getDependentsOfSuperior(id_superior: string) {
    return this.http
      .get<jobResponse[]>(`${this.url}/dependents/${id_superior}`)
      .pipe(map((resp) => resp));
  }
  removeDependent(id_dependent: string) {
    return this.http
      .delete<jobResponse>(`${this.url}/dependent/${id_dependent}`)
      .pipe(map((resp) => resp));
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ jobs: jobResponse[]; length: number }>(
      `${this.url}`,
      { params }
    );
  }
  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ jobs: jobResponse[]; length: number }>(
      `${this.url}/search/${term}`,
      { params }
    );
  }

  add(name: string) {
    return this.http.post<jobResponse>(`${this.url}`, { nombre: name });
  }

  edit(id: string, name?: string) {
    return this.http.patch<jobResponse>(`${this.url}/${id}`, {
      nombre: name,
    });
  }

  getOrganization() {
    // !TODO ORG CHART
    // return this.http.get<orgChartData[]>(`${base_url}/jobs/organization`).pipe(
    //   map((resp) => {
    //     return resp.map((el) => {
    //       el.data.forEach((item, index) => {
    //         if (item.name === 'Sin funcionario') {
    //           el.data[index].tags = ['no-user'];
    //         }
    //       });
    //       return el;
    //     });
    //   })
    // );
  }
}
