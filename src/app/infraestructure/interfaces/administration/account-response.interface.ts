import { dependencyResponse } from './dependency-response.interface';
import { officerResponse } from './oficer-response.interface';

export interface accountResponse {
  _id: string;
  dependencia: dependencyResponse;
  login: string;
  rol: string;
  funcionario?: officerResponse;
  activo: boolean;
  isVisible: boolean;
}
