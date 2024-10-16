import {
  ExternalProcedure,
  GroupProcedure,
  StateProcedure,
} from '../../domain';
import { external } from '../interfaces/external.interface';

export class ExternalMapper {
  static fromResponse({ group, state, ...props }: external): ExternalProcedure {
    return new ExternalProcedure({
      ...props,
      group: group as GroupProcedure,
      state: state as StateProcedure,
    });
  }
}
