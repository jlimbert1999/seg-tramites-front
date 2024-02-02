import { groupProcedure } from '../group-procedure.interface';
import { procedure } from './procedure.interface';

export interface internalResponse extends procedure {
  group: groupProcedure.INTERNAL;
  details: Details;
}
interface Details {
  remitente: worker;
  destinatario: worker;
}
interface worker {
  nombre: string;
  cargo: string;
}
