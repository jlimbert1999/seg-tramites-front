import { Pipe, inject, type PipeTransform } from '@angular/core';
import { AuthService } from '../services';
import { observationResponse } from '../../infraestructure/interfaces';

@Pipe({
  name: 'filterObservations',
  standalone: true,
})
export class FilterObservationsPipe implements PipeTransform {
  private authService = inject(AuthService);
  transform(
    observatios: observationResponse[],
    filter: boolean
  ): observationResponse[] {
    if (!filter) return observatios;
    return observatios.filter(
      (observation) =>
        observation.account === this.authService.account()?.id_account
    );
  }
}
