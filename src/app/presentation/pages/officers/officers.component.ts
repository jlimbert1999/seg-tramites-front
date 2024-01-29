import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-officers',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './officers.component.html',
  styleUrl: './officers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficersComponent { }
