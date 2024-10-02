import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'search-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline">
      <mat-icon matPrefix>search</mat-icon>
      <input matInput placeholder="Buscar" [formControl]="control" />
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  control = new FormControl();
  onSearch = output<string>();

  constructor() {
    this.control.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe((term) => this.onSearch.emit(term));
  }
}
