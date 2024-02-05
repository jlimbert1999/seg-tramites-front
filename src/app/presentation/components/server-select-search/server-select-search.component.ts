import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReplaySubject, Subject, debounceTime, filter, takeUntil } from 'rxjs';

type MatSelectSearchData<T> = {
  text: string;
  value: T;
};

@Component({
  selector: 'server-select-search',
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
  templateUrl: './server-select-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerSelectSearchComponent<T> implements OnInit, OnDestroy {
  @Input() set initialValue(value: T) {
    this.bankCtrl.setValue(value);
  }
  @Input() placeholder = 'Buscar....';
  @Input({ required: true }) set data(values: MatSelectSearchData<T>[]) {
    this.filteredBanks.next(values);
  }
  @Output() onSearch: EventEmitter<string> = new EventEmitter();
  @Output() onSelect: EventEmitter<T | undefined> = new EventEmitter();

  public bankCtrl = new FormControl<T | null>(null);
  public bankFilterCtrl = new FormControl<string>('');
  public filteredBanks: ReplaySubject<MatSelectSearchData<T>[]> =
    new ReplaySubject<MatSelectSearchData<T>[]>(1);

  protected _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.bankFilterCtrl.valueChanges
      .pipe(
        filter((search) => !!search),
        takeUntil(this._onDestroy),
        debounceTime(350)
      )
      .subscribe((value) => {
        if (!value) console.log('mal');
        this.onSearch.emit(value!);
      });
  }

  selectOption(value: T) {
    this.onSelect.emit(value);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
