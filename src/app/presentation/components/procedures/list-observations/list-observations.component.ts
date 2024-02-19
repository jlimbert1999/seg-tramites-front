import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { observationResponse } from '../../../../infraestructure/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { FilterObservationsPipe } from '../../../pipes';
import { AuthService, ProcedureService } from '../../../services';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'list-observations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FilterObservationsPipe,
  ],
  templateUrl: './list-observations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListObservationsComponent {
  @Input() data: observationResponse[] = [];
  @Input() showOptions: boolean = false;
  @Output() solveObservation = new EventEmitter<string>();
  filter: boolean = false;

  private authService = inject(AuthService);

  ngOnInit(): void {}

  markAsSolved(observation: observationResponse) {
    this.solveObservation.emit(observation._id);
  }

  get manager() {
    return this.authService.account()?.id_account;
  }
}
