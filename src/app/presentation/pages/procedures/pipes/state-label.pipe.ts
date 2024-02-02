import { Pipe, type PipeTransform } from '@angular/core';
import { stateProcedure } from '../interfaces';

@Pipe({
  name: 'stateLabel',
  standalone: true,
})
export class StateLabelPipe implements PipeTransform {
  readonly validStatus = {
    [stateProcedure.ANULADO]: 'text-bg-danger',
    [stateProcedure.CONCLUIDO]: 'text-bg-dark',
    [stateProcedure.INSCRITO]: 'text-bg-primary',
    [stateProcedure.OBSERVADO]: 'text-bg-warning',
    [stateProcedure.REVISION]: 'text-bg-secondary',
    [stateProcedure.SUSPENDIDO]: 'text-bg-info',
  };
  transform(value: stateProcedure): string {
    return this.validStatus[value];
  }
}
