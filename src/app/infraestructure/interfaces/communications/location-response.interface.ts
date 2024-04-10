import { StatusMail } from '../../../domain/models';
import { dependencyResponse } from '../administration/dependency-response.interface';
import { officerResponse } from '../administration/oficer-response.interface';

export interface locationResponse {
  _id: string;
  dependencia: dependencyResponse;
  funcionario: officerResponse;
  status: StatusMail;
}
