import { Officer } from '../../../domain/models';

export interface receiver {
  id_account: string;
  officer: Officer;
  online: boolean;
}
