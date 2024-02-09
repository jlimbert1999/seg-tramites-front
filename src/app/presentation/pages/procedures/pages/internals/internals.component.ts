import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import {
  PaginatorComponent,
  SearchInputComponent,
  SidenavButtonComponent,
} from '../../../../components';
import { InternalProcedure } from '../../../../../domain/models';
import { CacheService, InternalService } from '../../../../services';
import { StateLabelPipe } from '../../../../pipes';
import { InternalComponent } from './internal/internal.component';

interface PaginationOptions {
  limit: number;
  index: number;
}
@Component({
  selector: 'app-internals',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
    MatToolbarModule,
    PaginatorComponent,
    MatMenuModule,
    MatButtonModule,
    SearchInputComponent,
    SidenavButtonComponent,
    SearchInputComponent,
    StateLabelPipe,
  ],
  templateUrl: './internals.component.html',
  styleUrl: './internals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalsComponent {
  private dialog = inject(MatDialog);
  private internalService = inject(InternalService);
  private cacheService = inject(CacheService);

  displayedColumns: string[] = [
    'code',
    'reference',
    'applicant',
    'state',
    'startDate',
    'send',
    'options',
  ];
  datasource = signal<InternalProcedure[]>([]);
  datasize = signal<number>(0);
  term: string = '';

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
    });
  }

  ngOnInit(): void {
    this.loadPaginationData();
  }

  getData(): void {
    const subscription =
      this.term !== ''
        ? this.internalService.search(this.term, this.limit, this.offset)
        : this.internalService.findAll(this.limit, this.offset);
    subscription.subscribe((data) => {
      this.datasource.set(data.procedures);
      this.datasize.set(data.length);
    });
  }

  applyFilter(term: string) {
    this.term = term;
    this.cacheService.pageIndex.set(0);
    this.getData();
  }

  add() {
    const dialogRef = this.dialog.open(InternalComponent, {
      width: '1000px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((procedure) => {
      if (procedure) {
        this.datasize.update((value) => value++);
        this.datasource.update((values) => {
          if (this.datasource.length === this.limit) values.pop();
          return [procedure, ...values];
        });
        this.send(procedure);
      }
    });
  }

  edit(procedure: InternalProcedure) {
    const dialogRef = this.dialog.open(InternalComponent, {
      width: '1000px',
      data: procedure,
    });
    dialogRef.afterClosed().subscribe((updatedProcedure) => {
      if (!updatedProcedure) return;
      this.datasource.update((values) => {
        const index = values.findIndex(
          (element) => element._id === updatedProcedure._id
        );
        values[index] = updatedProcedure;
        return [...values];
      });
    });
  }
  send(procedure: InternalProcedure) {}

  generateRouteMap(id_tramite: string) {}

  conclude(procedure: InternalProcedure) {}

  private savePaginationData(): void {
    this.cacheService.resetPagination();
    this.cacheService.storage[this.constructor.name] = {
      datasource: this.datasource(),
      datasize: this.datasize(),
      text: this.term,
    };
  }

  private loadPaginationData(): void {
    const cacheData = this.cacheService.storage[this.constructor.name];
    if (!this.cacheService.keepAliveData() || !cacheData) {
      this.getData();
      return;
    }
    this.datasource.set(cacheData.datasource);
    this.datasize.set(cacheData.datasize);
    this.term = cacheData.text;
  }

  changePage({ limit, index }: PaginationOptions) {
    this.cacheService.pageSize.set(limit);
    this.cacheService.pageIndex.set(index);
    this.getData();
  }

  get index() {
    return this.cacheService.pageIndex();
  }
  get limit() {
    return this.cacheService.pageSize();
  }
  get offset() {
    return this.cacheService.pageOffset();
  }

  get PageParam(): { limit: number; index: number } {
    return { limit: this.limit, index: this.index };
  }
}
