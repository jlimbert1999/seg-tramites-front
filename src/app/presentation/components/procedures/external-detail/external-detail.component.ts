import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { ExternalProcedure, StateProcedure } from '../../../../domain/models';
import { LocationComponent } from '../location/location.component';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, LocationComponent],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent implements OnInit {
  procedure = input.required<ExternalProcedure>();
  location = input.required<any[]>();
  eventChangeState = input<Observable<StateProcedure>>();
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (!this.eventChangeState) return;
    this.eventChangeState()
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        console.log(state);
        return new ExternalProcedure({ ...this.procedure(), state: state });
      });
  }

  get data() {
    return this.procedure();
  }
}
