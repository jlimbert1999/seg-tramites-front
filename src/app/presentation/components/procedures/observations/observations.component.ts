import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { Procedure, StateProcedure } from '../../../../domain/models';
import { AuthService, ProcedureService } from '../../../services';

@Component({
  selector: 'observations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './observations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationsComponent {
  private authService = inject(AuthService);
  private procedureService = inject(ProcedureService);

  public procedure = input.required<Procedure>();
  public enableOptions = input.required<boolean>();
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

  get account() {
    return this.authService.account()?.id_account;
  }
}
