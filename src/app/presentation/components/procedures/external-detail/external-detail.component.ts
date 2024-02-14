import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, map, timer } from 'rxjs';
import { ExternalProcedure } from '../../../../domain/models';
import { TimeManager } from '../../../../helpers';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent {
  @Input({ required: true }) data!: ExternalProcedure;
  $stopTimer = new Subject<void>();

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
