import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dependency',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './dependency.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependencyComponent { }
