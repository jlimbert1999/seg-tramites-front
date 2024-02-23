import { GroupProcedure, StateProcedure } from '../../../domain/models';

export interface reportProcedureData {
  id_procedure: string;
  group: GroupProcedure;
  state: StateProcedure;
  reference: string;
  date: string;
  code: string;
  applicant?: string;
}
