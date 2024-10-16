import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';

import { debounceTime, map, Observable, startWith, switchMap } from 'rxjs';

export type AutocompleteOption<T> = {
  text: string;
  value: T;
};

@Component({
  selector: 'autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  template: ` <form>
    <mat-form-field>
      <mat-label>{{ title() }}</mat-label>
      <input
        matInput
        #input
        aria-label="Autocomplete"
        [matAutocomplete]="auto"
        [placeholder]="placeholder()"
        [formControl]="stateCtrl"
      />
      <mat-autocomplete
        requireSelection
        #auto="matAutocomplete"
        (optionSelected)="select($event.option.value)"
      >
        @for (state of options(); track $index) {
        <mat-option [value]="state">
          {{ state.text }}
        </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent<T> implements OnInit {
  title = input.required<string>();
  placeholder = input<string>('Buscar');
  value = input<string>();
  options = model<AutocompleteOption<T>[]>();
  customFilter = input<boolean>(false);

  onSearch = output<string | null>();
  onSelect = output<T>();

  stateCtrl = new FormControl('');
  filteredStates: Observable<AutocompleteOption<T>[]>;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  constructor() {
    this.stateCtrl.valueChanges
      .pipe(debounceTime(350), takeUntilDestroyed())
      .subscribe((term) => {
        this.onSearch.emit(term);
      });
  }

  ngOnInit(): void {
    this.stateCtrl.setValue(this.value() ?? null);
  }

  displayFn(user: AutocompleteOption<T>): string {
    return user && user.text ? user.text : '';
  }

  select(e: any) {
    console.log(e);
  }
}
