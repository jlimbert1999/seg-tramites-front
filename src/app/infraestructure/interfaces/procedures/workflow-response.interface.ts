import { StatusMail } from '../../../domain/models';

export interface workflowResponse {
  emitter: participant;
  outboundDate: string;
  duration: string;
  dispatches: dispatch[];
}

interface dispatch {
  _id: string;
  receiver: participant;
  duration: string;
  reference: string;
  attachmentQuantity: string;
  internalNumer: string;
  status: StatusMail;
  inboundDate?: string;
  eventLog?: eventLog;
}

interface participant {
  cuenta: string;
  fullname: string;
  jobtitle?: string;
}

interface eventLog {
  manager: string;
  description: string;
  date: string;
}
