export interface ProcedureProps {
  _id: string;
  code: string;
  cite: string;
  type: string;
  amount: string;
  isSend: boolean;
  reference: string;
  startDate: string;
  endDate?: string;
  account: manager;
  group: GroupProcedure;
  state: StateProcedure;
}

export enum GroupProcedure {
  External = 'ExternalDetail',
  Internal = 'InternalDetail',
}

export enum StateProcedure {
  Inscrito = 'INSCRITO',
  Observado = 'OBSERVADO',
  Revision = 'EN REVISION',
  Concluido = 'CONCLUIDO',
  Anulado = 'ANULADO',
  Suspendido = 'SUSPENDIDO',
}

interface manager {
  _id: string;
  funcionario?: officer;
}
interface officer {
  fullname: string;
  jobtitle?: string;
}

export abstract class Procedure {
  public readonly _id: string;
  public readonly code: string;
  public readonly type: string;
  public readonly group: GroupProcedure;
  public readonly startDate: Date;
  public readonly account: manager;
  public readonly endDate?: Date;
  public state: StateProcedure;
  public cite: string;
  public reference: string;
  public amount: string;
  public isSend: boolean;

  constructor({
    _id,
    code,
    cite,
    type,
    account,
    state,
    reference,
    amount,
    isSend,
    startDate,
    endDate,
    group,
  }: ProcedureProps) {
    this._id = _id;
    this.code = code;
    this.cite = cite;
    this.type = type;
    this.account = account;
    this.state = state;
    this.reference = reference;
    this.amount = amount;
    this.isSend = isSend;
    this.group = group;
    this.startDate = new Date(startDate);
    if (endDate) this.endDate = new Date(endDate);
  }

  get titleManager(): string {
    if (!this.account.funcionario) return 'Funcionario desvinculado';
    return `${this.account.funcionario.fullname} (${
      this.account.funcionario.jobtitle ?? 'SIN CARGO'
    })`;
  }

  get citeCode() {
    if (this.cite === '') return 'S/C';
    return this.cite;
  }

  get isEditable(): boolean {
    if (this.state !== 'INSCRITO') return false;
    return true;
  }

  get canBeManaged() {
    if (this.state !== 'INSCRITO' || this.isSend) return false;
    return true;
  }

  getDuration() {
    // return TimeControl.duration(this.startDate, this.endDate ?? new Date());
  }

  StartDateDetail() {
    // return {
    //   date: TimeControl.formatDate(this.startDate, 'DD/MM/YY'),
    //   hour: TimeControl.formatDate(this.startDate, 'HH:mm'),
    // };
  }
  abstract get applicantDetails(): {
    emitter: { fullname: string; jobtitle: string };
    receiver?: { fullname: string; jobtitle: string };
  };
}
