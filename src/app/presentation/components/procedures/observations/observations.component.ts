import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MaterialModule } from '../../../../material.module';
import { observationResponse } from '../../../../infraestructure/interfaces';
import { AuthService, ProcedureService } from '../../../services';
import { Procedure, StateProcedure } from '../../../../domain/models';

@Component({
  selector: 'observations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './observations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationsComponent {
  private procedureService = inject(ProcedureService);
  private authService = inject(AuthService);

  public procedure = input.required<Procedure>();
  public enable = input<boolean>(false);
  public onStateChange = output<StateProcedure>();
  public observations = signal<observationResponse[]>([]);
  public isFocused: boolean = false;
  public descripcion = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.procedureService
      .getObservations(this.procedure()._id)
      .subscribe((data) => {
        this.observations.set(data);
      });
  }

  add() {
    this.procedureService
      .addObservation(this.procedure()._id, this.descripcion.value)
      .subscribe((obs) => {
        this.observations.update((values) => [obs, ...values]);
        this.onStateChange.emit(StateProcedure.Observado);
        this.removeFocus();
      });
  }

  removeFocus() {
    this.isFocused = false;
    this.descripcion.reset();
  }

  solve() {
    // this.solveObservation.emit('');
  }

  get manager() {
    return this.authService.account()?.id_account;
  }
}
