import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  externalResponse,
  internalResponse,
  workflowResponse,
} from '../../../infraestructure/interfaces';

import { Observable, map } from 'rxjs';
import {
  ExternalProcedure,
  GroupProcedure,
  InternalProcedure,
  Procedure,
  Workflow,
} from '../../../domain/models';

type procedureResponse = internalResponse | externalResponse;
interface ProcedureDetailResponse {
  procedure: procedureResponse;
  workflow: workflowResponse[];
  observations: any[];
}
type valid = InternalProcedure | ExternalProcedure;

@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  private readonly url = `${environment.base_url}/procedure`;
  private readonly http = inject(HttpClient);

  getWorkflow(id_procedure: string) {
    return this.http
      .get<workflowResponse[]>(`${this.url}/workflow/${id_procedure}`)
      .pipe(map((resp) => resp.map((el) => Workflow.responseToModel(el))));
  }

  getDetail(id_procedure: string, group: GroupProcedure) {
    return this.http
      .get<procedureResponse>(`${this.url}/detail/${group}/${id_procedure}`)
      .pipe(map((resp) => this.toModel(group, resp)));
  }

  getProcedureDetail(id: string, group: GroupProcedure) {
    return this.http
      .get<ProcedureDetailResponse>(`${this.url}/${group}/${id}`)
      .pipe(
        map((resp) => {
          return {
            procedure: this.toModel(group, resp.procedure),
            workflow: resp.workflow.map((el) => Workflow.responseToModel(el)),
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
      [GroupProcedure.Internal]: InternalProcedure.ResponseToModel(
        response as internalResponse
      ),
    };
    return models[group];
  }
}
