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
import { ReplaySubject, Subject, debounceTime, takeUntil } from 'rxjs';

type MatSelectSearchData<T> = {
  text: string;
  value: T;
};

@Component({
  selector: 'select-search',
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
  templateUrl: './select-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSearchComponent<T> implements OnInit, OnDestroy {
  @Input() isServerFilter: boolean = false;
  @Input({ required: true }) set data(values: MatSelectSearchData<T>[]) {
    this.filteredBanks.next(values);
  }
  @Output() onSearch: EventEmitter<string | null> = new EventEmitter();

  public bankCtrl = new FormControl<MatSelectSearchData<T> | null>(null);

  public bankFilterCtrl = new FormControl<string>('');

  public filteredBanks: ReplaySubject<MatSelectSearchData<T>[]> =
    new ReplaySubject<MatSelectSearchData<T>[]>(1);

  protected _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.bankFilterCtrl.valueChanges
      .pipe(
        takeUntil(this._onDestroy),
        debounceTime(this.isServerFilter ? 350 : 0)
      )
      .subscribe((value) => {
        this.onSearch.emit(value);
      });
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
