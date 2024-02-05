import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  workHistoryResponse,
  workflowResponse,
} from '../../../infraestructure/interfaces';
import {
  externalResponse,
  groupProcedure,
  internalResponse,
} from '../../pages/procedures/interfaces';
import { map } from 'rxjs';
import { ExternalProcedure } from '../../pages/procedures/models';

interface ProcedureDetailResponse {
  procedure: internalResponse | externalResponse;
  workflow: workflowResponse[];
  observations: any[];
}
@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  private readonly url = `${environment.base_url}/procedure`;
  private readonly http = inject(HttpClient);

  getProcedureDetail(id: string, group: groupProcedure) {
    return this.http
      .get<ProcedureDetailResponse>(`${this.url}/${group}/${id}`)
      .pipe(
        map((resp) => {
          return {
            procedure: this.toModel(group, resp.procedure),
            workflow: resp.workflow,
            observations: resp.observations,
          };
        })
      );
  }
  private toModel(
    group: groupProcedure,
    response: internalResponse | externalResponse
  ) {
    const models = {
      [groupProcedure.EXTERNAL]: ExternalProcedure.ResponseToModel(
        response as externalResponse
      ),
      [groupProcedure.INTERNAL]: ExternalProcedure.ResponseToModel(
        response as externalResponse
      ),
    };
    return models[group];
  }
}
