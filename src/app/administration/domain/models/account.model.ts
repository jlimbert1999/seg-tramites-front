import { Officer } from './officer.model';

interface AccountProps {
  _id: string;
  funcionario?: Officer;
  isVisible: boolean;
  dependencia: dependency;
  user: user;
  jobtitle: string;
}

interface dependency {
  _id: string;
  nombre: string;
}

interface user {
  login: string;
  isActive: boolean;
  role: string;
}

export class Account {
  _id: string;

  funcionario?: Officer;
  isVisible: boolean;
  dependencia: dependency;
  jobtitle: string;
  user: user;

  constructor({
    _id,
    funcionario,
    isVisible,
    dependencia,
    jobtitle,
    user,
  }: AccountProps) {
    this._id = _id;
    this.funcionario = funcionario;
    this.dependencia = dependencia;
    this.isVisible = isVisible;
    this.jobtitle = jobtitle;
    this.user = user;
  }

  fullnameManager(): string {
    return this.funcionario ? this.funcionario.fullname : 'DESVINCULADO';
  }
}
