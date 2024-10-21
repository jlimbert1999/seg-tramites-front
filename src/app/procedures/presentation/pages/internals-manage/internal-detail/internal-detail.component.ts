import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-internal-detail',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './internal-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalDetailComponent { }
