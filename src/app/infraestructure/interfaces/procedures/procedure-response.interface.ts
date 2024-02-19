import { typeProcedureResponse } from '../administration/type-procedure-response.interface';
import { accountResponse } from '../administration/account-response.interface';
import { GroupProcedure, StateProcedure } from '../../../domain/models';

export interface procedure {
  _id: string;
  code: string;
  cite: string;
  reference: string;
  group: GroupProcedure;
  amount: string;
  send: boolean;
  startDate: string;
  endDate?: string;
  type: typeProcedureResponse | string;
  account: accountResponse | string;
  state: StateProcedure;
}
