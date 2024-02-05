import {
  statusMail,
  workflowResponse,
} from '../../../../infraestructure/interfaces';

interface EventLog {
  manager: string;
  description: string;
  date: string;
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
  status: statusMail;
  inboundDate?: TimeDetail;
  eventLog?: EventLog;
}
interface TimeDetail {
  date: string;
  hour: string;
  fulldate: string;
}
export interface Participant {
  cuenta: string;
  fullname: string;
  jobtitle: string;
  duration: string;
}

export class Workflow {
  static fromResponse(workflow: workflowResponse) {
    return new Workflow({
      emitter: {
        ...workflow.emitter,
        jobtitle: workflow.emitter.jobtitle ?? 'Sin cargo',
      },
      outboundDate: {
        fulldate: new Date(workflow.outboundDate).toISOString(),
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
