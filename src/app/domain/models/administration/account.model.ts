import { accountResponse } from '../../../infraestructure/interfaces/administration/account-response.interface';
import { Officer } from './officer.model';

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
  institution: string;
}

export class Account {
  _id: string;
  login: string;
  rol: string;
  activo: boolean;
  funcionario?: any;
  isVisible: boolean;
  dependencia: dependency;

  static fromJson(account: accountResponse) {
    const { funcionario, dependencia, ...values } = account;
    return new Account({
      ...values,
      dependencia: {
        _id: dependencia._id,
        nombre: dependencia.nombre,
        institution: dependencia.institucion.nombre,
      },
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
