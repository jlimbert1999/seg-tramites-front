import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-internal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './internal.component.html',
  styleUrl: './internal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalComponent { }
