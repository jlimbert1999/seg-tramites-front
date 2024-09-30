import { Account } from '../../domain/models/account.model';
import { account } from '../interfaces/account.interface';
import { OfficerMapper } from './officer.mapper';

export class AccountMapper {
  static fromResponse(response: account): Account {
    const { funcionario, ...values } = response;
    return new Account({
      ...values,
      ...(funcionario && {
        funcionario: OfficerMapper.fromResponse(funcionario),
      }),
    });
  }
}
