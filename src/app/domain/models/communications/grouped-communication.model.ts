import { groupedCommunicationResponse } from '../../../infraestructure/interfaces';
import { Communication, StatusMail } from '../procedures/communication.model';

interface GroupedCommunicationProps {
  account: string;
  procedure: procedure;
  date: Date;
  dispatches: Communication[];
}
interface procedure {
  _id: string;
  code: string;
  reference: string;
}

export class GroupedCommunication {
  public account: string;
  public procedure: procedure;
  public date: Date;
  public dispatches: Communication[];

  static responseToModel({ _id, sendings }: groupedCommunicationResponse) {
    return new GroupedCommunication({
      account: _id.account,
      procedure: _id.procedure,
      date: new Date(_id.outboundDate),
      dispatches: sendings.map((el) => Communication.fromResponse(el)),
    });
  }
  constructor({
    account,
    procedure,
    date,
    dispatches,
  }: GroupedCommunicationProps) {
    this.account = account;
    this.procedure = procedure;
    this.date = date;
    this.dispatches = dispatches;
  }

  canBeManaged(): boolean {
    return this.dispatches.some((mail) => mail.status !== StatusMail.Pending);
  }
}
