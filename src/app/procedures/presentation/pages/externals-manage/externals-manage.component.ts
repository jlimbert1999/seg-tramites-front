import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ExternalDialogComponent } from './external-dialog/external-dialog.component';
import { MaterialModule } from '../../../../material.module';
import {
  PaginatorComponent,
  TransferDetails,
  DispatcherComponent,
} from '../../../../presentation/components';
import { StateLabelPipe } from '../../../../presentation/pipes';
import { CacheService, PdfService } from '../../../../presentation/services';
import { SearchInputComponent } from '../../../../shared';
import { ExternalService, ProcedureService } from '../../services';
import { ExternalProcedure } from '../../../domain';
import { SubmissionDialogComponent } from '../../../../communications/pages/inbox/submission-dialog/submission-dialog.component';

interface CacheData {
  datasource: ExternalProcedure[];
  datasize: number;
  text: string;
}
@Component({
  selector: 'app-externals-manage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PaginatorComponent,
    PaginatorComponent,
    SearchInputComponent,
    StateLabelPipe,
  ],
  templateUrl: './externals-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExternalsManageComponent {
  private dialog = inject(MatDialog);
  private externalService = inject(ExternalService);
  private cacheService: CacheService<CacheData> = inject(CacheService);
  private procedureService = inject(ProcedureService);
  private pdfService = inject(PdfService);

  public term: string = '';
  public datasource = signal<ExternalProcedure[]>([]);
  public datasize = signal<number>(0);
  public displayedColumns: string[] = [
    'code',
    'reference',
    'applicant',
    'state',
    'startDate',
    'options',
  ];

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
    });
  }

  ngOnInit(): void {
    // this.loadPaginationData();
    this.getData();
  }

  getData() {
    this.externalService.findAll(this.limit, this.offset).subscribe((data) => {
      this.datasource.set(data.procedures);
      this.datasize.set(data.length);
    });
  }

  applyFilter(term: string) {
    this.cacheService.pageIndex.set(0);
    this.term = term;
    this.getData();
  }

  create(): void {
    const dialogRef = this.dialog.open(ExternalDialogComponent, {
      maxWidth: '1000px',
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasize.update((value) => (value += 1));
      this.datasource.update((values) => {
        if (values.length === this.limit) values.pop();
        return [result, ...values];
      });
      this.send(result);
    });
  }

  update(procedure: ExternalProcedure): void {
    const dialogRef = this.dialog.open(ExternalDialogComponent, {
      maxWidth: '1000px',
      width: '1000px',
      data: procedure,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => {
        const indexFound = values.findIndex(({ _id }) => _id === result._id);
        values[indexFound] = result;
        return [...values];
      });
    });
  }

  send(procedure: ExternalProcedure) {
    const transfer: TransferDetails = {
      id_procedure: procedure._id,
      code: procedure.code,
      attachmentQuantity: procedure.numberOfDocuments,
    };
    const dialogRef = this.dialog.open(SubmissionDialogComponent, {
      maxWidth: '1200px',
      width: '1200px',
      data: transfer,
      disableClose: true,
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

  generateRouteMap(procedure: ExternalProcedure) {
    // this.procedureService.getWorkflow(procedure._id).subscribe((workflow) => {
    //   this.pdfService.generateRouteSheet(procedure, workflow);
    // });
  }

  changePage(params: { limit: number; index: number }) {
    this.cacheService.pageSize.set(params.limit);
    this.cacheService.pageIndex.set(params.index);
    this.getData();
  }

  private savePaginationData(): void {
    this.cacheService.resetPagination();
    const cache: CacheData = {
      datasource: this.datasource(),
      datasize: this.datasize(),
      text: this.term,
    };
    this.cacheService.save('externals', cache);
  }

  private loadPaginationData(): void {
    const cache = this.cacheService.load('externals');
    if (!this.cacheService.keepAliveData() || !cache) return this.getData();
    this.datasource.set(cache.datasource);
    this.datasize.set(cache.datasize);
    this.term = cache.text;
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
