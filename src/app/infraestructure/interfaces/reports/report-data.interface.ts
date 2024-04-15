import { GroupProcedure, StateProcedure } from '../../../domain/models';

export interface TableProcedureColums {
  columnDef: keyof TableProcedureData;
  header: string;
}
export interface TableProcedureData {
  _id: string;
  group: GroupProcedure;
  state: StateProcedure;
  reference: string;
  startDate: string;
  code: string;
  applicant?: string;
}
