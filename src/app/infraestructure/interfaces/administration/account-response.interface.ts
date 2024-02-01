import { dependencyResponse } from './dependency-response.interface';

export interface accountResponse {
  _id: string;
  dependencia: dependencyResponse;
  login: string;
  rol: string;
  funcionario?: any;
  activo: boolean;
  isVisible: boolean;
}
