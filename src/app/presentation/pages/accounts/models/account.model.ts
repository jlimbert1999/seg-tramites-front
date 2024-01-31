import { Officer } from '../../officers/models/officer.model';
import { accountResponse } from '../interfaces/account-response.interface';

interface AccountProps {
  _id: string;
  login: string;
  rol: string;
  activo: boolean;
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
  login: string;
  rol: string;
  activo: boolean;
  funcionario?: Officer;
  isVisible: boolean;
  dependencia: dependency;

  static fromJson(account: accountResponse) {
    const { funcionario, ...values } = account;
    return new Account({
      ...values,
      ...(funcionario && { funcionario: Officer.officerFromJson(funcionario) }),
    });
  }
  constructor({
    _id,
    login,
    rol,
    activo,
    funcionario,
    isVisible,
    dependencia,
  }: AccountProps) {
    this._id = _id;
    this.funcionario = funcionario;
    this.dependencia = dependencia;
    this.isVisible = isVisible;
    this.activo = activo;
    this.login = login;
    this.rol = rol;
  }

  fullnameManager(): string {
    return this.funcionario ? this.funcionario.fullname : 'DESVINCULADO';
  }

  jobtitleManager(): string {
    return this.funcionario ? this.funcionario.jobtitle : 'DESVINCULADO';
  }
}
