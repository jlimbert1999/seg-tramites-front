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
} from '../../../components';
import { InternalComponent } from './internal/internal.component';
import {
  InternalService,
  CacheService,
  ProcedureService,
  PdfService,
} from '../../../services';
import { InternalProcedure } from '../../../../domain/models';
import { transferDetails } from '../../../../infraestructure/interfaces';
import { StateLabelPipe } from '../../../pipes';
import { DispatcherComponent } from '../../../components/procedures/dispatcher/dispatcher.component';

interface PaginationOptions {
  limit: number;
  index: number;
}
interface CacheData {
  results: InternalProcedure[];
  length: number;
  term: string;
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
  private procedureService = inject(ProcedureService);
  private pdfService = inject(PdfService);
  private cacheService: CacheService<CacheData> = inject(CacheService);

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
      if (!procedure) return;
      this.datasize.update((value) => (value += 1));
      this.datasource.update((values) => {
        if (values.length === this.limit) values.pop();
        return [procedure, ...values];
      });
      this.send(procedure);
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

  send(procedure: InternalProcedure) {
    const transfer: transferDetails = {
      id_procedure: procedure._id,
      code: procedure.code,
      attachmentQuantity: procedure.amount,
    };
    const dialogRef = this.dialog.open(DispatcherComponent, {
      width: '1200px',
      data: transfer,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((message) => {
      if (!message) return;
      this.datasource.update((values) => {
        const indexFound = values.findIndex(
          (element) => element._id === procedure._id
        );
        values[indexFound].isSend = true;
        return [...values];
      });
    });
  }

  generateRouteMap(procedure: InternalProcedure) {
    this.procedureService.getWorkflow(procedure._id).subscribe((workflow) => {
      this.pdfService.generateRouteSheet(procedure, workflow);
    });
  }

  conclude(procedure: InternalProcedure) {}

  private savePaginationData(): void {
    this.cacheService.resetPagination();
    const cache = {
      results: this.datasource(),
      length: this.datasize(),
      term: this.term,
    };
    this.cacheService.save('internals', cache);
  }

  private loadPaginationData(): void {
    const cacheData = this.cacheService.load('internals');
    if (!this.cacheService.keepAliveData() || !cacheData) {
      this.getData();
      return;
    }
    this.datasource.set(cacheData.results);
    this.datasize.set(cacheData.length);
    this.term = cacheData.term;
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
