import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { observationResponse } from '../../../../infraestructure/interfaces';
import { MaterialModule } from '../../../../material.module';
import { StateProcedure } from '../../../../domain/models';
import { ProcedureService } from '../../../services';

@Component({
  selector: 'observations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './observations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationsComponent {
  private readonly procedureService = inject(ProcedureService);

  manager = input.required<string | undefined>();
  onStateChange = output<StateProcedure>();

  public observations = model.required<observationResponse[]>();
  public isFocused: boolean = false;
  public descripcion = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  ngOnInit(): void {}

  add() {
    // this.procedureService
    //   .addObservation(this.procedure(), this.descripcion.value)
    //   .subscribe((obs) => {
    //     this.observations.update((values) => [obs, ...values]);
    //     this.onStateChange.emit(StateProcedure.Observado);
    //     this.removeFocus();
    //   });
  }

  removeFocus() {
    this.isFocused = false;
    this.descripcion.reset();
  }

  solve(id: string) {
    this.procedureService.solveObservation(id).subscribe((resp) => {
      this.observations.update((values) => {
        const index = values.findIndex((el) => el._id === id);
        values[index].isSolved = true;
        return [...values];
      });
      this.onStateChange.emit(resp.state);
    });
  }
}
