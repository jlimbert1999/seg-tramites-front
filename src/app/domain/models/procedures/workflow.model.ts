import { StatusMail } from './communication.model';
import { workflowResponse } from '../../../infraestructure/interfaces';
import { TimeManager } from '../../../helpers';

interface WorkflowProps {
  emitter: participant;
  time: time;
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
  time: time;
  eventLog?: eventLog;
}
interface time {
  date: string;
  hour: string;
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
  public time: time;

  static reponseToModel(response: workflowResponse) {
    return new Workflow({
      emitter: response.emitter,
      duration: response.duration,
      time: {
        date: TimeManager.formatDate(response.outboundDate, 'MM/D/YYYY'),
        hour: TimeManager.formatDate(response.outboundDate, 'HH:mm'),
      },
      dispatches: response.dispatches.map(({ inboundDate, ...values }) => ({
        ...values,
        time: inboundDate
          ? {
              date: TimeManager.formatDate(inboundDate, 'MM/D/YYYY'),
              hour: TimeManager.formatDate(inboundDate, 'HH:mm'),
            }
          : { fulldate: '', date: '', hour: '' },
      })),
    });
  }

  constructor({ emitter, duration, time, dispatches }: WorkflowProps) {
    this.emitter = emitter;
    this.time = time;
    this.duration = duration;
    this.dispatches = dispatches;
  }
}
