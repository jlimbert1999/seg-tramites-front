import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  model,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import {
  ExternalProcedure,
  Procedure,
  StateProcedure,
} from '../../../../domain/models';
import { LocationComponent } from '../location/location.component';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, LocationComponent],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent implements OnInit {
  procedure = model.required<ExternalProcedure>();
  location = input.required<any[]>();
  eventChangeState = input<Observable<StateProcedure>>();
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (!this.eventChangeState) return;
    this.eventChangeState()
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        console.log(state);
        this.procedure.set(
          new ExternalProcedure({
            ...this.data,
            state: StateProcedure.Anulado,
          })
        );
      });
  }

  get data() {
    return this.procedure();
  }
}
