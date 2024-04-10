export interface ProcedureProps {
  _id: string;
  code: string;
  cite: string;
  type: string;
  amount: string;
  isSend: boolean;
  reference: string;
  startDate: Date;
  endDate?: Date;
  account: manager;
  group: GroupProcedure;
  state: StateProcedure;
}

export interface OriginDetails {
  emitter: officer;
  receiver?: officer;
  phone?: string;
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
  id: string;
  officer?: officer;
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
    if (!this.account?.officer) return 'Funcionario desvinculado';
    return `${this.account.officer.fullname} (${
      this.account.officer.jobtitle ?? 'SIN CARGO'
    })`;
  }

  get citeCode() {
    if (this.cite === '') return 'S/C';
    return this.cite;
  }

  get isEditable(): boolean {
    return this.state === 'INSCRITO'
  }

  get canBeManaged() {
    if (this.isSend) return false;
    return true;
  }

  abstract originDetails(): OriginDetails;
}
