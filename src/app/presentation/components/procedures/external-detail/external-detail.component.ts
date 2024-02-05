import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, timer } from 'rxjs';
import { ExternalProcedure } from '../../../../domain/models';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent {
  @Input({ required: true }) data!: ExternalProcedure;

  duration = toSignal<string>(
    timer(0, 1000).pipe(map((value) => new Date().toLocaleDateString()))
  );
}
