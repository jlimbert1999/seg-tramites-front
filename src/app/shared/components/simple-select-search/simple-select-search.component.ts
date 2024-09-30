import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  effect,
  input,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

type MatSelectSearchData<T> = {
  text: string;
  value: T;
};
@Component({
  selector: 'simple-select-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxMatSelectSearchModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  template: `
    <mat-form-field>
      <mat-select
        [formControl]="bankCtrl"
        [placeholder]="placeholder()"
        (selectionChange)="selectOption($event.value)"
      >
        <mat-option>
          <ngx-mat-select-search
            placeholderLabel="Ingrese el termino a buscar"
            noEntriesFoundLabel="Sin resultados"
            [formControl]="bankFilterCtrl"
          ></ngx-mat-select-search>
        </mat-option>
        @if(bankCtrl.value && !isRequired()){
        <mat-option>-- Ninguno --</mat-option>
        }
        <mat-option
          *ngFor="let bank of filteredBanks | async"
          [value]="bank.value"
        >
          {{ bank.text }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSelectSearchComponent<T> {
  elements = input.required<MatSelectSearchData<T>[]>();
  placeholder = input<string>('Buscar....');
  isRequired = input<boolean>(true);
  onSelect = output<T | undefined>();

  @Input() set initialValue(value: T) {
    this.bankCtrl.setValue(value);
  }

  public bankCtrl = new FormControl<T | null>(null);
  public bankFilterCtrl = new FormControl<string>('');
  public filteredBanks = new ReplaySubject<MatSelectSearchData<T>[]>(1);
  protected _onDestroy = new Subject<void>();

  constructor() {
    effect(() => {
      this.filteredBanks.next(this.elements());
    });
  }

  ngOnInit(): void {
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterBanks());
  }

  selectOption(value: T | undefined) {
    if (this.isRequired() && !value) return;
    this.onSelect.emit(value);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBanks() {
    if (!this.elements()) return;
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.elements().slice());
      return;
    }
    this.filteredBanks.next(
      this.elements().filter(
        (bank) => bank.text.toLowerCase().indexOf(search!.toLowerCase()) > -1
      )
    );
  }
}
