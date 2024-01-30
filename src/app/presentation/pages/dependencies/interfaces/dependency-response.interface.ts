import { institutionResponse } from '../../institutions/interface/institution-response.interface';

export interface dependencyResponse {
  _id: string;
  nombre: string;
  sigla: string;
  codigo: string;
  activo: boolean;
  institucion: institutionResponse;
}
