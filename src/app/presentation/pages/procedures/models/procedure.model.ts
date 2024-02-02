import { groupProcedure, stateProcedure } from '../interfaces';

export interface ProcedureProps {
  _id: string;
  code: string;
  cite: string;
  amount: string;
  isSend: boolean;
  reference: string;
  endDate?: string;
  startDate: string;
  type: string;
  account: manager;
  group: groupProcedure;
  state: stateProcedure;
}

interface manager {
  _id: string;
  funcionario?: officer;
}

interface officer {
  nombre: string;
  materno: string;
  paterno: string;
}

export abstract class Procedure {
  public readonly _id: string;
  public readonly code: string;
  public readonly type: string;
  public readonly group: groupProcedure;
  public readonly startDate: Date;
  public readonly account: manager;
  public readonly endDate?: Date;
  public state: stateProcedure;
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

  get fullNameManager(): string {
    if (!this.account.funcionario) return 'Desvinculado';
    return `${this.account.funcionario.nombre} ${this.account.funcionario.paterno} ${this.account.funcionario.materno}`;
  }

  get citeCode() {
    if (this.cite === '') return 'S/C';
    return this.cite;
  }

  get isEditable(): boolean {
    if (this.state !== stateProcedure.INSCRITO) return false;
    return true;
  }

  get canBeManaged() {
    if (this.state !== stateProcedure.INSCRITO || this.isSend) return false;
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
  abstract get applicantDetails(): { emiter: any; receiver: any };
}
