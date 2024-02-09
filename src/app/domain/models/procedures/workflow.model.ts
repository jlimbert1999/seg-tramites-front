import { StatusMail } from './communication.model';
import { workflowResponse } from '../../../infraestructure/interfaces';

interface WorkflowProps {
  emitter: participant;
  date: Date;
  duration: string;
  dispatches: dispatch[];
}

interface dispatch {
  _id: string;
  receiver: participant;
  duration: string;
  reference: string;
  internalNumer: string;
  attachmentQuantity: string;
  status: StatusMail;
  date?: Date;
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

export class Workflow {
  public dispatches: dispatch[];
  public duration: string;
  public emitter: participant;
  public date: Date;

  static reponseToModel(response: workflowResponse) {
    return new Workflow({
      emitter: response.emitter,
      duration: response.duration,
      date: new Date(response.outboundDate),
      dispatches: response.dispatches.map(({ inboundDate, ...values }) => ({
        ...values,
        date: inboundDate ? new Date(inboundDate) : undefined,
      })),
    });
  }

  constructor({ emitter, duration, date, dispatches }: WorkflowProps) {
    this.emitter = emitter;
    this.date = date;
    this.duration = duration;
    this.dispatches = dispatches;
  }
}
