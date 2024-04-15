import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import {
  PaginatorComponent,
  SearchInputComponent,
  DispatcherComponent,
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
import { MaterialModule } from '../../../../material.module';

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
    RouterModule,
    MaterialModule,
    PaginatorComponent,
    SearchInputComponent,
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
      maxWidth: '1000px',
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
      maxWidth: '1000px',
      data: procedure,
    });
    dialogRef.afterClosed().subscribe((procedure) => {
      if (!procedure) return;
      this.datasource.update((values) => {
        const index = values.findIndex(({ _id }) => _id === procedure._id);
        values[index] = procedure;
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
      maxWidth: '1200px',
      width: '1200px',
      data: transfer,
    });
    dialogRef.afterClosed().subscribe((message) => {
      if (!message) return;
      this.datasource.update((values) => {
        const index = values.findIndex(({ _id }) => _id === procedure._id);
        values[index].isSend = true;
        return [...values];
      });
    });
  }

  generateRouteMap(procedure: InternalProcedure) {
    this.procedureService.getWorkflow(procedure._id).subscribe((workflow) => {
      this.pdfService.generateRouteSheet(procedure, workflow);
    });
  }

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

  changePage(params: { limit: number; index: number }) {
    this.cacheService.pageSize.set(params.limit);
    this.cacheService.pageIndex.set(params.index);
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
