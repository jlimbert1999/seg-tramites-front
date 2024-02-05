import { StatusMail } from '../../../domain/models';

export interface workflowResponse {
  emitter: Participant;
  outboundDate: string;
  detail: Detail[];
}
interface Detail {
  _id: string;
  receiver: Participant;
  procedure: string;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  inboundDate?: string;
  status: StatusMail;
  eventLog: EventLog;
}
interface EventLog {
  manager: string;
  description: string;
  date: string;
}

interface Participant {
  cuenta: string;
  fullname: string;
  jobtitle?: string;
  duration: string;
}
