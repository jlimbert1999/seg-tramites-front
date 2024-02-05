import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExternalProcedure } from '../../../pages/procedures/models';

@Component({
  selector: 'external-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './external-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent {
  @Input({ required: true }) data!: ExternalProcedure;
}
