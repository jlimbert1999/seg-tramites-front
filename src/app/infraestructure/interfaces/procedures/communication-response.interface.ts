import { GroupProcedure, StatusMail } from '../../../domain/models';

export interface communicationResponse {
  _id: string;
  emitter: officer;
  receiver: officer;
  procedure: procedure;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  outboundDate: string;
  status: StatusMail;
  inboundDate?: string;
  eventLog?: eventLog;
}

interface officer {
  cuenta: string;
  fullname: string;
  jobtitle: string;
}

interface procedure {
  _id: string;
  code: string;
  reference: string;
  group: GroupProcedure;
}
interface eventLog {
  manager: string;
  description: string;
  date: string;
}
