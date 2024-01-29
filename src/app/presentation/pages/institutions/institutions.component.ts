import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-institutions',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './institutions.component.html',
  styleUrl: './institutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsComponent { }
