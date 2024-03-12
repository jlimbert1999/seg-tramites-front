import { dependencyResponse } from '../administration/dependency-response.interface';
import { officerResponse } from '../administration/oficer-response.interface';

export interface locationResponse {
  dependencia: dependencyResponse;
  funcionario: officerResponse;
}
