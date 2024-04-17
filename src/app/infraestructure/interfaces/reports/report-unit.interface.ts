import { StatusMail } from '../../../domain/models';

export interface reportUnit {
  _id: ID;
  details: details[];
}

interface ID {
  _id: string;
  funcionario?: Funcionario;
}

interface Funcionario {
  nombre: string;
  paterno: string;
  materno: string;
  cargo?: Cargo;
}

interface Cargo {
  nombre: string;
}

interface details {
  status: StatusMail;
  total: number;
}
