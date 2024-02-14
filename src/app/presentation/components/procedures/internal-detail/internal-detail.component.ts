import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, timer } from 'rxjs';
import { InternalProcedure } from '../../../../domain/models';
import { StateLabelPipe } from '../../../pipes';
import { TimeManager } from '../../../../helpers';

@Component({
  selector: 'internal-detail',
  standalone: true,
  imports: [CommonModule, StateLabelPipe],
  templateUrl: './internal-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalDetailComponent {
  @Input({ required: true }) data!: InternalProcedure;

  duration = toSignal<string>(
    timer(0, 1000).pipe(
      map(() => {
        return TimeManager.duration(
          this.data.startDate,
          this.data.endDate ?? new Date()
        );
      })
    )
  );
}
