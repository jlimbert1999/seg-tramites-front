interface AccountProps {
  login: string;
  password: string;
  dependencia: string;
  rol: string;
  funcionario?: string;
}
export class AccountDto {
  login: string;
  password: string;
  dependencia: string;
  rol: string;
  funcionario?: string;

  static FormtoModel(fomAccount: any) {
    return new AccountDto({
      login: fomAccount['login'],
      dependencia: fomAccount['dependencia'],
      rol: fomAccount['rol'],
      password: fomAccount['password'],
      funcionario: fomAccount['funcionario'],
    });
  }
  constructor({ login, password, dependencia, rol, funcionario }: AccountProps) {
    this.login = login;
    this.password = password;
    this.dependencia = dependencia;
    this.rol = rol;
    this.funcionario = funcionario;
  }
}
