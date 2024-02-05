import { GroupProcedure } from '../../../domain/models';
import { procedure } from './procedure-response.interface';

export interface internalResponse extends procedure {
  group: GroupProcedure.Internal;
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
