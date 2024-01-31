import { jobResponse } from '../../jobs/interfaces/job-response.interface';
import { officerResponse } from './oficer-response.interface';

export interface workHistoryResponse {
  _id: string;
  officer: string;
  job: jobResponse;
  date: string;
}
