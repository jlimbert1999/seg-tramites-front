import { Account } from '../../domain/models/account.model';
import { account } from '../interfaces/account.interface';
import { OfficerMapper } from './officer.mapper';

export class AccountMapper {
  static fromResponse(response: account): Account {
    const { officer, ...values } = response;
    return new Account({
      ...values,
      ...(officer && {
        officer: OfficerMapper.fromResponse(officer),
      }),
    });
  }
}
