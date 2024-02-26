import { GroupProcedure, StateProcedure } from '../../../domain/models';

export interface TableProcedureColums {
  columnDef: keyof TableProcedureData;
  header: string;
}
export interface TableProcedureData {
  id_procedure: string;
  group: GroupProcedure;
  state: StateProcedure;
  reference: string;
  date: string;
  code: string;
  applicant?: string;
}
