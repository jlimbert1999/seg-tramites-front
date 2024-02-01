import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-simple-select-search',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './simple-select-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSelectSearchComponent { }
