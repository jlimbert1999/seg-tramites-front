import { communicationResponse } from '../procedures/communication-response.interface';
import { procedure } from '../procedures/procedure-response.interface';

export interface groupedCommunicationResponse {
  _id: ID;
  sendings: communicationResponse[];
}
interface ID {
  account: string;
  procedure: procedure;
  outboundDate: string;
}
