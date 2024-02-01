import { jobResponse } from './job-response.interface';

export interface workHistoryResponse {
  _id: string;
  officer: string;
  job: jobResponse;
  date: string;
}
