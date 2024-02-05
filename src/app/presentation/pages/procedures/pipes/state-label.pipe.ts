import { Pipe, type PipeTransform } from '@angular/core';
import { StateProcedure } from '../../../../domain/models';

@Pipe({
  name: 'stateLabel',
  standalone: true,
})
export class StateLabelPipe implements PipeTransform {
  readonly validStatus = {
    [StateProcedure.Anulado]: 'text-bg-danger',
    [StateProcedure.Concluido]: 'text-bg-dark',
    [StateProcedure.Inscrito]: 'text-bg-primary',
    [StateProcedure.Observado]: 'text-bg-warning',
    [StateProcedure.Revision]: 'text-bg-secondary',
    [StateProcedure.Suspendido]: 'text-bg-info',
  };
  transform(value: StateProcedure): string {
    return this.validStatus[value];
  }
}
