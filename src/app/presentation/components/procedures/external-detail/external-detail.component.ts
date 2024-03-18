import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  model,
  signal,
} from '@angular/core';

import { MaterialModule } from '../../../../material.module';
import { LocationComponent } from '../location/location.component';
import { ObservationsComponent } from '../observations/observations.component';
import { ExternalProcedure, StateProcedure } from '../../../../domain/models';
import { ProcedureService } from '../../../services';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LocationComponent,
    ObservationsComponent,
  ],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent implements OnInit {
  private procedureService = inject(ProcedureService);
  procedure = model.required<ExternalProcedure>();
  location = input.required<any[]>();

  ngOnInit(): void {}

  print() {
    this.procedure.update((val) => {
      return new ExternalProcedure({
        ...this.data,
        state: StateProcedure.Observado,
      });
    });
  }

  set state(state: StateProcedure) {
    this.procedure.update((values) => {
      return new ExternalProcedure({ ...values, state: state });
    });
  }

  get data() {
    return this.procedure();
  }
}
