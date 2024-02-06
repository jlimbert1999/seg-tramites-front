import { StatusMail } from '../../../domain/models';

export interface workflowResponse {
  _id: string;
  emitter: Officer;
  procedure: string;
  date: string;
  internalNumber: string;
  dispatches: Dispatch[];
}

interface Dispatch {
  receiver: Officer;
  reference: string;
  attachmentQuantity: string;
  date: string;
  status: StatusMail;
  eventLog?: EventLog;
}

interface EventLog {
  manager: string;
  description: string;
  date: string;
}

interface Officer {
  account: string;
  fullname: string;
  jobtitle: string;
}
