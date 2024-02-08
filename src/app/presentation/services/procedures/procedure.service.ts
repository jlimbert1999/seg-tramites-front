import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  externalResponse,
  internalResponse,
  workflowResponse,
} from '../../../infraestructure/interfaces';

import { map } from 'rxjs';
import {
  ExternalProcedure,
  GroupProcedure,
  Workflow,
} from '../../../domain/models';

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

  getProcedureDetail(id: string, group: GroupProcedure) {
    return this.http
      .get<ProcedureDetailResponse>(`${this.url}/${group}/${id}`)
      .pipe(
        map((resp) => {
          return {
            procedure: this.toModel(group, resp.procedure),
            workflow: resp.workflow.map((el) => Workflow.reponseToModel(el)),
            observations: resp.observations,
          };
        })
      );
  }
  private toModel(
    group: GroupProcedure,
    response: internalResponse | externalResponse
  ) {
    const models = {
      [GroupProcedure.External]: ExternalProcedure.ResponseToModel(
        response as externalResponse
      ),
      [GroupProcedure.Internal]: ExternalProcedure.ResponseToModel(
        response as externalResponse
      ),
    };
    return models[group];
  }
}
