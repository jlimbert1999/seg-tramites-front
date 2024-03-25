export interface reportUnit {
  _id: ID;
  pendings: number;
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
