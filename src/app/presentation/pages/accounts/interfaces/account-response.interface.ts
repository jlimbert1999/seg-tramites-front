import { dependencyResponse } from '../../dependencies/interfaces/dependency-response.interface';
import { officerResponse } from '../../officers/interfaces';

export interface accountResponse {
  _id: string;
  dependencia: dependencyResponse;
  login: string;
  rol: string;
  funcionario?: officerResponse;
  activo: boolean;
  isVisible: boolean;
}
