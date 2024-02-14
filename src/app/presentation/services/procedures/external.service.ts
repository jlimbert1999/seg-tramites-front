import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ExternalProcedureDto } from '../../../infraestructure/dtos';
import { ExternalProcedure } from '../../../domain/models';
import {
  externalResponse,
  typeProcedureResponse,
} from '../../../infraestructure/interfaces';

interface CreateExternalForm {
  FormProcedure: Object;
  FormApplicant: Object;
  FormRepresentative: Object;
  Requeriments: string[];
}
interface UpdateExternalForm {
  id: string;
  FormProcedure: Object;
  FormApplicant: Object;
  FormRepresentative: Object;
}
@Injectable({
  providedIn: 'root',
})
export class ExternalService {
  private readonly base_url = `${environment.base_url}/external`;
  constructor(private http: HttpClient) {}

  getSegments() {
    return this.http.get<string[]>(`${this.base_url}/segments`);
  }
  getTypesProceduresBySegment(segment: string) {
    return this.http.get<typeProcedureResponse[]>(
      `${this.base_url}/types-procedures/${segment}`
    );
  }

  add({
    FormApplicant,
    FormProcedure,
    FormRepresentative,
    Requeriments,
  }: CreateExternalForm) {
    const procedure = ExternalProcedureDto.fromForm({
      formProcedure: FormProcedure,
      formApplicant: FormApplicant,
      formRepresentative: FormRepresentative,
      requeriments: Requeriments,
    });
    return this.http
      .post<externalResponse>(`${this.base_url}`, procedure)
      .pipe(map((response) => ExternalProcedure.ResponseToModel(response)));
  }

  edit({
    id,
    FormProcedure,
    FormRepresentative,
    FormApplicant,
  }: UpdateExternalForm) {
    const updateProcedure = {
      procedure: FormProcedure,
      details: {
        solicitante: FormApplicant,
        ...(Object.keys(FormRepresentative).length > 0 && {
          representante: FormRepresentative,
        }),
      },
    };
    return this.http
      .put<externalResponse>(`${this.base_url}/${id}`, updateProcedure)
      .pipe(map((response) => ExternalProcedure.ResponseToModel(response)));
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http
      .get<{ procedures: externalResponse[]; length: number }>(
        `${this.base_url}`,
        { params }
      )
      .pipe(
        map((response) => {
          const model = response.procedures.map((procedure) =>
            ExternalProcedure.ResponseToModel(procedure)
          );
          return { procedures: model, length: response.length };
        })
      );
  }

  search(text: string, limit: number, offset: number) {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<{ procedures: externalResponse[]; length: number }>(
        `${this.base_url}/search/${text}`,
        { params }
      )
      .pipe(
        map((response) => {
          const model = response.procedures.map((procedure) =>
            ExternalProcedure.ResponseToModel(procedure)
          );
          return { procedures: model, length: response.length };
        })
      );
  }

  addObservacion(descripcion: string, id_tramite: string, funcionario: string) {
    return this.http
      .put<{ ok: boolean; observaciones: any }>(
        `${this.base_url}/externos/observacion/${id_tramite}`,
        {
          descripcion,
          funcionario,
        }
      )
      .pipe(
        map((resp) => {
          return resp.observaciones;
        })
      );
  }
  putObservacion(id_tramite: string) {
    return this.http
      .put<{ ok: boolean; estado: string }>(
        `${this.base_url}/externos/observacion/corregir/${id_tramite}`,
        {}
      )
      .pipe(
        map((resp) => {
          return resp.estado;
        })
      );
  }

  conclude(id_tramite: string, descripcion: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(
        `${this.base_url}/externos/concluir/${id_tramite}`,
        { descripcion }
      )
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
  cancelProcedure(id_tramite: string, descripcion: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(
        `${this.base_url}/externos/cancelar/${id_tramite}`,
        { descripcion }
      )
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
  unarchive(id_tramite: string) {
    return this.http
      .put<{ ok: boolean; message: string }>(
        `${this.base_url}/externos/desarchivar/${id_tramite}`,
        {}
      )
      .pipe(
        map((resp) => {
          return resp.message;
        })
      );
  }
}
