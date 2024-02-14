import { communicationResponse } from '../../../infraestructure/interfaces';
import { GroupProcedure, StateProcedure } from './procedure.model';

interface CommunicationProps {
  readonly _id: string;
  readonly emitter: officer;
  readonly receiver: officer;
  readonly procedure: procedure;
  readonly reference: string;
  readonly attachmentQuantity: string;
  readonly internalNumber: string;
  readonly outboundDate: string;
  readonly inboundDate?: string;
  readonly eventLog?: eventLog;
  status: StatusMail;
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
  state: StateProcedure;
}
interface eventLog {
  manager: string;
  description: string;
  date: string;
}
export enum StatusMail {
  Received = 'received',
  Completed = 'completed',
  Rejected = 'rejected',
  Pending = 'pending',
  Archived = 'archived',
}

export class Communication {
  readonly _id: string;
  readonly emitter: officer;
  readonly receiver: officer;
  readonly procedure: procedure;
  readonly reference: string;
  readonly attachmentQuantity: string;
  readonly internalNumber: string;
  readonly outboundDate: string;
  readonly inboundDate?: string;
  readonly eventLog?: eventLog;
  status: StatusMail;

  static fromResponse(response: communicationResponse) {
    return new Communication({
      _id: response._id,
      emitter: response.emitter,
      receiver: response.receiver,
      procedure: response.procedure,
      reference: response.reference,
      attachmentQuantity: response.attachmentQuantity,
      internalNumber: response.internalNumber,
      outboundDate: response.outboundDate,
      inboundDate: response.inboundDate,
      eventLog: response.eventLog,
      status: response.status,
    });
  }

  constructor({
    _id,
    emitter,
    receiver,
    procedure,
    reference,
    attachmentQuantity,
    internalNumber,
    outboundDate,
    inboundDate,
    eventLog,
    status,
  }: CommunicationProps) {
    this._id = _id;
    this.emitter = emitter;
    this.receiver = receiver;
    this.procedure = procedure;
    this.reference = reference;
    this.attachmentQuantity = attachmentQuantity;
    this.internalNumber = internalNumber;
    this.outboundDate = outboundDate;
    this.inboundDate = inboundDate;
    this.eventLog = eventLog;
    this.status = status;
  }

  statusLabel(): { label: string; color: string } {
    const states = {
      [StatusMail.Received]: { label: 'RECIBIDO', color: '#55A630' },
      [StatusMail.Rejected]: { label: 'RECHAZADO', color: '#D90429' },
      [StatusMail.Completed]: { label: 'COMPLETADO', color: '#415A77' },
      [StatusMail.Archived]: { label: 'ARCHIVADO', color: '#0077B6' },
      [StatusMail.Pending]: { label: 'PENDIENTE', color: '#F48C06' },
    };
    return states[this.status];
  }

  groupLabel(): string {
    const groups = {
      [GroupProcedure.External]: 'EXTERNO',
      [GroupProcedure.Internal]: 'INTERNO',
    };
    return groups[this.procedure.group];
  }
}
