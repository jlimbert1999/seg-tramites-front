import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { ExternalProcedure } from '../../../../domain/models';
import { TimeManager } from '../../../../helpers';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './external-detail.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent implements OnInit {
  @Input() data!: ExternalProcedure;
  private destroyRef = inject(DestroyRef);
  public duration = signal<string>('');

  ngOnInit(): void {
    if (this.data.endDate) {
      const time = TimeManager.duration(
        this.data.startDate,
        this.data.endDate!
      );
      this.duration.set(time);
      return;
    }
    timer(0, 1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const time = TimeManager.duration(this.data.startDate, new Date());
        this.duration.set(time);
      });
  }
}
