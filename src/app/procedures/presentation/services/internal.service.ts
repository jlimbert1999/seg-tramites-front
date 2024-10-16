import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateInternalProcedureDto,
  UpdateInternalProcedureDto,
} from '../../../infraestructure/dtos';
import {
  internalResponse,
  officerResponse,
  typeProcedureResponse,
} from '../../../infraestructure/interfaces';
import { InternalProcedure, Officer } from '../../../domain/models';

@Injectable({
  providedIn: 'root',
})
export class InternalService {
  private http = inject(HttpClient);
  private readonly url = `${environment.base_url}/internal`;

  create(form: Object) {
    const procedure = CreateInternalProcedureDto.fromForm(form);
    return this.http
      .post<internalResponse>(`${this.url}`, procedure)
      .pipe(map((response) => InternalProcedure.ResponseToModel(response)));
  }
  update(id: string, form: Object) {
    const procedure = UpdateInternalProcedureDto.fromForm(form);
    return this.http
      .put<internalResponse>(`${this.url}/${id}`, procedure)
      .pipe(map((response) => InternalProcedure.ResponseToModel(response)));
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ procedures: internalResponse[]; length: number }>(`${this.url}`, {
        params,
      })
      .pipe(
        map((response) => {
          const model = response.procedures.map((procedure) =>
            InternalProcedure.ResponseToModel(procedure)
          );
          return { procedures: model, length: response.length };
        })
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

  findParticipant(text: string) {
    return this.http
      .get<officerResponse[]>(`${this.url}/participant/${text}`)
      .pipe(map((resp) => resp.map((el) => Officer.officerFromJson(el))));
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
