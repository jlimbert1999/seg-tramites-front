import { account } from '../../../administration/infrastructure';
import { Officer } from './officer.model';

interface AccountProps {
  _id: string;
  funcionario?: Officer;
  jobtitle: string;
  isVisible: boolean;
  dependencia: dependency;
}
interface dependency {
  _id: string;
  nombre: string;
}

export class Account {
  _id: string;
  login: string;
  rol: string;
  funcionario?: Officer;
  jobtitle: string;
  isVisible: boolean;
  dependencia: dependency;

  constructor({
    _id,
    funcionario,
    isVisible,
    dependencia,
    jobtitle,
  }: AccountProps) {
    this._id = _id;
    this.funcionario = funcionario;
    this.dependencia = dependencia;
    this.isVisible = isVisible;
    this.jobtitle = jobtitle;
  }

  fullnameManager(): string {
    return this.funcionario ? this.funcionario.fullname : 'DESVINCULADO';
  }

  jobtitleManager(): string {
    return this.funcionario ? this.funcionario.jobtitle : 'DESVINCULADO';
  }
}
