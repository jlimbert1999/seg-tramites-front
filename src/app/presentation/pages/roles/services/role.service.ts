import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  roleResponse,
  systemResource,
} from '../../../../infraestructure/interfaces';
import { RoleDto } from '../../../../infraestructure/dtos';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly url = `${environment.base_url}/roles`;
  constructor(private http: HttpClient) {}

  findAll() {
    return this.http
      .get<{ roles: roleResponse[]; length: number }>(`${this.url}`)
      .pipe(map((resp) => ({ roles: resp.roles, length: resp.length })));
  }

  getResources() {
    return this.http.get<systemResource[]>(`${this.url}/resources`);
  }

  add(name: string, systemResources: systemResource[]) {
    const Role = RoleDto.toModel(name, systemResources);
    return this.http.post<roleResponse>(`${this.url}`, Role);
  }

  edit(id: string, name: string, systemResources: systemResource[]) {
    const Role = RoleDto.toModel(name, systemResources);
    return this.http.put<roleResponse>(`${this.url}/${id}`, Role);
  }
}
