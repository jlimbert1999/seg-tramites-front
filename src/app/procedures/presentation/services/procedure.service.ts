import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  externalResponse,
  internalResponse,
  locationResponse,
  observationResponse,
  workflowResponse,
} from '../../../infraestructure/interfaces';

import { map } from 'rxjs';
import {
  ExternalProcedure,
  GroupProcedure,
  InternalProcedure,
  StateProcedure,
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

  getLocation(id_procedure: string) {
    return this.http.get<locationResponse[]>(
      `${this.url}/location/${id_procedure}`
    );
  }

  addObservation(id_procedure: string, description: string) {
    return this.http.post<observationResponse>(
      `${this.url}/observation/${id_procedure}`,
      { description }
    );
  }
  solveObservation(id_observation: string) {
    return this.http.put<{ state: StateProcedure }>(
      `${this.url}/observation/${id_observation}`,
      undefined
    );
  }

  getObservations(id_procedure: string) {
    return this.http.get<observationResponse[]>(
      `${this.url}/observations/${id_procedure}`
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
