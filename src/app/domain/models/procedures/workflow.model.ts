import { workflowResponse } from '../../../infraestructure/interfaces';

export enum StatusMail {
  Received = 'received',
  Completed = 'completed',
  Rejected = 'rejected',
  Pending = 'pending',
  Archived = 'archived',
}

export interface WorkflowProps {
  emitter: Participant;
  outboundDate: TimeDetail;
  detail: Detail[];
}

interface Detail {
  _id: string;
  receiver: Participant;
  procedure: string;
  reference: string;
  attachmentQuantity: string;
  internalNumber: string;
  status: StatusMail;
  inboundDate?: TimeDetail;
  eventLog?: EventLog;
}
interface EventLog {
  manager: string;
  description: string;
  date: string;
}

interface TimeDetail {
  date: string;
  hour: string;
  fulldate: string;
}

interface Participant {
  cuenta: string;
  fullname: string;
  jobtitle: string;
  duration: string;
}

export class Workflow {
  static fromResponse(workflow: workflowResponse) {
    console.log(workflow);
    return new Workflow({
      emitter: {
        ...workflow.emitter,
        jobtitle: 'Sin cargo',
      },
      outboundDate: {
        fulldate: workflow.outboundDate,
        date: '',
        hour: '',
      },
      detail: workflow.detail.map(({ inboundDate, receiver, ...values }) => {
        return {
          receiver: {
            ...receiver,
            jobtitle: receiver.jobtitle ?? 'Sin cargo',
          },
          ...values,
          inboundDate: inboundDate
            ? {
                fulldate: '',
                date: '',
                hour: '',
              }
            : { fulldate: '', date: '', hour: '' },
        };
      }),
    });
  }
  readonly emitter: Participant;
  readonly outboundDate: TimeDetail;
  readonly detail: Detail[];
  constructor({ emitter, outboundDate, detail }: WorkflowProps) {
    this.emitter = emitter;
    this.outboundDate = outboundDate;
    this.detail = detail;
  }
}
