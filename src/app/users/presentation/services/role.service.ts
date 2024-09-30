import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { resource, role, RoleDto } from '../../infrastructure';


@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly url = `${environment.base_url}/roles`;
  constructor(private http: HttpClient) {}

  findAll() {
    return this.http
      .get<{ roles: role[]; length: number }>(`${this.url}`)
      .pipe(map((resp) => ({ roles: resp.roles, length: resp.length })));
  }

  getResources() {
    return this.http.get<resource[]>(`${this.url}/resources`).pipe(
      map((resp) =>
        resp.map(({ actions, ...props }) => ({
          ...props,
          actions: actions.map((acc) => ({ ...acc, isSelected: false })),
          isSelected: false,
        }))
      )
    );
  }

  add(name: string, resources: resource[]) {
    const Role = RoleDto.toModel(name, resources);
    return this.http.post<role>(`${this.url}`, Role);
  }

  edit(id: string, name: string, resources: resource[]) {
    const Role = RoleDto.toModel(name, resources);
    return this.http.put<role>(`${this.url}/${id}`, Role);
  }
}
