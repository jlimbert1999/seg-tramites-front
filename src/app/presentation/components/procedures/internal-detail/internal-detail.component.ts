import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InternalProcedure } from '../../../../domain/models';
import { LocationComponent } from '../location/location.component';

@Component({
  selector: 'internal-detail',
  standalone: true,
  imports: [CommonModule, LocationComponent],
  templateUrl: './internal-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalDetailComponent {
  procedure = input.required<InternalProcedure>();
  location = input.required<any[]>();

  get data() {
    return this.procedure();
  }
}
