import { GroupProcedure, StateProcedure } from '../../domain';
import { InternalProcedure } from '../../domain/models/internal.model';
import { internal } from '../interfaces/internal.interface';

export class InternalMapper {
  static fromResponse({ group, state, ...props }: internal): InternalProcedure {
    return new InternalProcedure({
      ...props,
      group: group as GroupProcedure,
      state: state as StateProcedure,
    });
  }
}
