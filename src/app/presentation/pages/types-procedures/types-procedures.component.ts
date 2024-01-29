import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-types-procedures',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './types-procedures.component.html',
  styleUrl: './types-procedures.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypesProceduresComponent { }
