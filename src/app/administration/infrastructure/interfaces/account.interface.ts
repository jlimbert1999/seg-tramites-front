import { user } from '../../../users/infrastructure';
import { dependency } from './dependency.interface';
import { officer } from './officer.interface';

export interface account {
  _id: string;
  dependencia: dependency;
  funcionario?: officer;
  jobtitle: string;
  isVisible: boolean;
  user: user;
}
