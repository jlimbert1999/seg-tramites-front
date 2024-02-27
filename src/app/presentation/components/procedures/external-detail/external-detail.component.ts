import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ExternalProcedure } from '../../../../domain/models';

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

  ngOnInit(): void {}
}
