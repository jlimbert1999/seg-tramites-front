import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';

type MatSelectSearchData<T> = {
  text: string;
  value: T;
};
@Component({
  selector: 'simple-select-search',
  standalone: true,

  imports: [
    CommonModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './simple-select-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSelectSearchComponent<T> {
  @Input() set initialValue(value: T) {
    this.bankCtrl.setValue(value);
  }
  @Input() allowNullValues: boolean = false;
  @Input() placeholder = 'Buscar....';
  @Input({ required: true }) set data(values: MatSelectSearchData<T>[]) {
    this.banks = values;
    this.filteredBanks.next(values);
  }
  @Output() onSelect: EventEmitter<T> = new EventEmitter();

  protected banks: MatSelectSearchData<T>[] = [];
  public bankCtrl = new FormControl<T | null>(null);
  public bankFilterCtrl = new FormControl<string>('');
  public filteredBanks: ReplaySubject<MatSelectSearchData<T>[]> =
    new ReplaySubject<MatSelectSearchData<T>[]>(1);

  protected _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterBanks());
  }

  selectOption(value: T | undefined) {
    if (!this.allowNullValues && !value) return;
    this.onSelect.emit(value);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBanks() {
    if (!this.banks) return;
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.banks.slice());
      return;
    }
    this.filteredBanks.next(
      this.banks.filter(
        (bank) => bank.text.toLowerCase().indexOf(search!.toLowerCase()) > -1
      )
    );
  }
}
