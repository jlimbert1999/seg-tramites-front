import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-internal-detail',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>internal-detail works!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalDetailComponent { }
