import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dependencies',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './dependencies.component.html',
  styleUrl: './dependencies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependenciesComponent { }
