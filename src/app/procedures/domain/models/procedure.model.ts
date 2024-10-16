export interface ProcedureProps {
  _id: string;
  code: string;
  cite: string;
  type: string;
  numberOfDocuments: string;
  isSend: boolean;
  reference: string;
  account: string;
  group: GroupProcedure;
  state: StateProcedure;
  endDate?: Date;
}

export interface OriginDetails {
  emitter: officer;
  receiver?: officer;
  phone?: string;
}

export enum GroupProcedure {
  External = 'ExternalProcedure',
  Internal = 'InternalProcedure',
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
  public readonly createdAt: Date;
  public readonly account: string;
  public readonly endDate?: Date;
  public state: StateProcedure;
  public cite: string;
  public reference: string;
  public numberOfDocuments: string;
  public isSend: boolean;

  constructor({
    _id,
    code,
    cite,
    type,
    account,
    state,
    reference,
    numberOfDocuments,
    isSend,
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
    this.numberOfDocuments = numberOfDocuments;
    this.isSend = isSend;
    this.group = group;
    if (endDate) this.endDate = new Date(endDate);
  }


  get citeCode() {
    if (this.cite === '') return 'S/C';
    return this.cite;
  }

  get isEditable(): boolean {
    return this.state === 'INSCRITO';
  }

}
