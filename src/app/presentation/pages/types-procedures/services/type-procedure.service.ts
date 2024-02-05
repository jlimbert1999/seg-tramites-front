import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { TypeProcedureDto } from '../dtos/type-procedure.dto';
import { typeProcedureResponse } from '../../../../infraestructure/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TypeProcedureService {
  private readonly url = `${environment.base_url}/types-procedures`;
  constructor(private http: HttpClient) {}

  getSegments() {
    return this.http.get<string[]>(`${this.url}/segments`);
  }

  search(term: string, limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ types: typeProcedureResponse[]; length: number }>(
      `${this.url}/search/${term}`,
      {
        params,
      }
    );
  }

  findAll(limit: number, offset: number) {
    const params = new HttpParams({ fromObject: { limit, offset } });
    return this.http.get<{ types: typeProcedureResponse[]; length: number }>(
      `${this.url}`,
      {
        params,
      }
    );
  }

  add(form: Object) {
    const type = TypeProcedureDto.FormToModel(form);
    return this.http.post<typeProcedureResponse>(`${this.url}`, type);
  }

  edit(id: string, typeProcedure: Partial<TypeProcedureDto>) {
    return this.http.put<typeProcedureResponse>(
      `${this.url}/${id}`,
      typeProcedure
    );
  }

  delete(id_tipoTramite: string) {
    return this.http.delete<{ activo: boolean }>(
      `${this.url}/${id_tipoTramite}`
    );
  }
}
