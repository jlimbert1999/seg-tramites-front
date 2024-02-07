import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-outbox',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './outbox.component.html',
  styleUrl: './outbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutboxComponent { }
