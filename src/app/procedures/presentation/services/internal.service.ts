import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateInternalProcedureDto,
  UpdateInternalProcedureDto,
} from '../../../infraestructure/dtos';
import {
  account,
  internalResponse,
  officerResponse,
  typeProcedureResponse,
} from '../../../infraestructure/interfaces';
import { InternalProcedure, Officer } from '../../../domain/models';
import { AccountMapper } from '../../../administration/infrastructure';
import { internal, InternalMapper } from '../../infrastructure';

interface findProps {
  term?: string;
  limit: number;
  offset: number;
}
@Injectable({
  providedIn: 'root',
})
export class InternalService {
  private http = inject(HttpClient);
  private readonly url = `${environment.base_url}/internal`;

  create(form: Object) {
    return this.http
      .post<internal>(`${this.url}`, form)
      .pipe(map((response) => InternalMapper.fromResponse(response)));
  }

  update(id: string, form: Object) {
    return this.http
      .patch<internal>(`${this.url}/${id}`, form)
      .pipe(map((response) => InternalMapper.fromResponse(response)));
  }

  findAll({ limit, offset, term }: findProps) {
    const params = new HttpParams({
      fromObject: { limit, offset, ...(term && { term }) },
    });
    return this.http
      .get<{ procedures: internal[]; length: number }>(`${this.url}`, {
        params,
      })
      .pipe(
        map(({ procedures, length }) => ({
          procedures: procedures.map((el) => InternalMapper.fromResponse(el)),
          length,
        }))
      );
  }

  search(text: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ procedures: internalResponse[]; length: number }>(
        `${this.url}/search/${text}`,
        { params }
      )
      .pipe(
        map((response) => {
          const model = response.procedures.map((procedure) =>
            InternalProcedure.ResponseToModel(procedure)
          );
          return { procedures: model, length: response.length };
        })
      );
  }

  searchAccounts(text: string) {
    return this.http
      .get<account[]>(`${this.url}/participant/${text}`)
      .pipe(map((resp) => resp.map((el) => AccountMapper.fromResponse(el))));
  }

  getTypesProcedures() {
    return this.http
      .get<typeProcedureResponse[]>(`${this.url}/types-procedures`)
      .pipe(
        map((resp) => {
          return resp;
        })
      );
  }
  conclude(id_tramite: string, descripcion: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(
        `${this.url}/concluir/${id_tramite}`,
        { descripcion }
      )
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
  cancel(id_tramite: string, descripcion: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(
        `${this.url}/internos/cancelar/${id_tramite}`,
        { descripcion }
      )
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
}
