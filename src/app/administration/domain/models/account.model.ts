import { Officer } from './officer.model';

interface AccountProps {
  _id: string;
  funcionario?: Officer;
  isVisible: boolean;
  dependencia: dependency;
}

interface dependency {
  _id: string;
  nombre: string;
}

export class Account {
  _id: string;

  funcionario?: Officer;
  isVisible: boolean;
  dependencia: dependency;

  constructor({
    _id,

    funcionario,
    isVisible,
    dependencia,
  }: AccountProps) {
    this._id = _id;
    this.funcionario = funcionario;
    this.dependencia = dependencia;
    this.isVisible = isVisible;
 
  }

  fullnameManager(): string {
    return this.funcionario ? this.funcionario.fullname : 'DESVINCULADO';
  }
}
