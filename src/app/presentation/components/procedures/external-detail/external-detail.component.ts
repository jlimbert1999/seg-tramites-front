import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Subject, forkJoin } from 'rxjs';
import {
  ExternalProcedure,
  GroupProcedure,
  StateProcedure,
} from '../../../../domain/models';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent implements OnInit {
  @Input() changeState: Subject<void> | undefined;
  @Input({ required: true }) procedure!: ExternalProcedure;
  @Input({ required: true }) location!: any[];

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    if (!this.changeState) return;
    this.changeState.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const updated = new ExternalProcedure({
        ...this.procedure,
        state: StateProcedure.Observado,
      });
    });
  }
}
