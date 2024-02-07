import { workflowResponse } from '../../../infraestructure/interfaces';
import { StatusMail } from './communication.model';

interface WorkflowProps {
  _id: string;
  date: Date;
  emitter: Officer;
  procedure: string;
  dispatches: Dispatch[];
  internalNumber: string;
}

interface Dispatch {
  date?: Date;
  receiver: Officer;
  reference: string;
  status: StatusMail;
  eventLog?: EventLog;
  attachmentQuantity: string;
}

interface EventLog {
  date: string;
  manager: string;
  description: string;
}

interface Officer {
  account: string;
  fullname: string;
  jobtitle?: string;
}

export class Workflow {
  public _id: string;
  public date: Date;
  public emitter: Officer;
  public procedure: string;
  public dispatches: Dispatch[];
  public internalNumber: string;

  static reponseToModel(response: workflowResponse) {
    return new Workflow({
      _id: response._id,
      date: new Date(response.date),
      emitter: response.emitter,
      procedure: response.internalNumber,
      dispatches: response.dispatches.map(({ date, ...values }) => ({
        ...values,
        date: new Date(date),
      })),
      internalNumber: response.internalNumber,
    });
  }

  constructor({
    _id,
    date,
    emitter,
    procedure,
    dispatches,
    internalNumber,
  }: WorkflowProps) {
    this._id = _id;
    this.date = date;
    this.emitter = emitter;
    this.procedure = procedure;
    this.dispatches = dispatches;
    this.internalNumber = internalNumber;
  }
}
