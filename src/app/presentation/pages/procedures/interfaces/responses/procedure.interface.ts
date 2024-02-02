import { typeProcedureResponse } from '../../../types-procedures/interfaces/type-procedure-response.interface';
import { accountResponse } from '../../../../../infraestructure/interfaces';
import { groupProcedure } from '../group-procedure.interface';
import { stateProcedure } from '../state-procedure.interface';

export interface procedure {
  _id: string;
  code: string;
  cite: string;
  reference: string;
  amount: string;
  send: boolean;
  startDate: string;
  endDate?: string;
  type: typeProcedureResponse;
  account: accountResponse;
  state: stateProcedure;
  group: groupProcedure;
}
