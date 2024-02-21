import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import {
  PaginatorComponent,
  SearchInputComponent,
  SidenavButtonComponent,
} from '../../../components';
import { ProcedureDispatcherComponent } from '../../communications/inbox/procedure-dispatcher/procedure-dispatcher.component';
import {
  ExternalService,
  CacheService,
  ProcedureService,
  PdfService,
} from '../../../services';
import { ExternalComponent } from './external/external.component';
import { ExternalProcedure } from '../../../../domain/models';
import { transferDetails } from '../../../../infraestructure/interfaces';
import { StateLabelPipe } from '../../../pipes';

interface PaginationOptions {
  limit: number;
  index: number;
}
interface CacheData {
  datasource: ExternalProcedure[];
  datasize: number;
  text: string;
}
@Component({
  selector: 'app-externals',
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
    StateLabelPipe,
  ],
  templateUrl: './externals.component.html',
  styleUrl: './externals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalsComponent {
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
    'send',
    'menu-options',
  ];

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
    });
  }

  ngOnInit(): void {
    this.loadPaginationData();
  }

  getData() {
    const subscription = this.term
      ? this.externalService.search(this.term, this.limit, this.offset)
      : this.externalService.findAll(this.limit, this.offset);
    subscription.subscribe((data) => {
      this.datasource.set(data.procedures);
      this.datasize.set(data.length);
    });
  }

  applyFilter(term: string) {
    this.cacheService.pageIndex.set(0);
    this.term = term;
    this.getData();
  }

  add() {
    const dialogRef = this.dialog.open(ExternalComponent, {
      width: '1200px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((createdProcedure) => {
      if (!createdProcedure) return;
      this.datasize.update((value) => (value += 1));
      this.datasource.update((values) => {
        if (values.length === this.limit) values.pop();
        return [createdProcedure, ...values];
      });
      this.send(createdProcedure);
    });
  }

  edit(procedure: ExternalProcedure) {
    const dialogRef = this.dialog.open(ExternalComponent, {
      width: '1200px',
      data: procedure,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((updatedProcedure) => {
      if (!updatedProcedure) return;
      this.datasource.update((values) => {
        const indexFound = values.findIndex(
          (element) => element._id === updatedProcedure._id
        );
        values[indexFound] = updatedProcedure;
        return [...values];
      });
    });
  }

  send(procedure: ExternalProcedure) {
    const transfer: transferDetails = {
      id_procedure: procedure._id,
      code: procedure.code,
      attachmentQuantity: procedure.amount,
    };
    const dialogRef = this.dialog.open(ProcedureDispatcherComponent, {
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

  generateRouteMap(procedure: ExternalProcedure) {
    this.procedureService.getWorkflow(procedure._id).subscribe((workflow) => {
      this.pdfService.generateRouteSheet(procedure, workflow);
    });
  }

  generateTicket(tramite: ExternalProcedure) {}

  conclude(procedure: ExternalProcedure) {
    // this.alertService.showConfirmAlert(
    //   `¿Concluir el tramite ${procedure.code}?`,
    //   'Los tramites concluidos desde su administacion no pueden ser desarchivados',
    //   'Ingrese una referencia para concluir',
    //   (description) => {
    //     const archive: EventProcedureDto = {
    //       procedure: procedure._id,
    //       description,
    //       stateProcedure: stateProcedure.CONCLUIDO,
    //     };
    //     this.dataSource.update((values) => {
    //       const indexFound = values.findIndex(
    //         (element) => element._id === procedure._id
    //       );
    //       values[indexFound].state = stateProcedure.CONCLUIDO;
    //       return [...values];
    //     });
    //   }
    // );
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
    if (!this.cacheService.keepAliveData() || !cache) {
      this.getData();
      return;
    }
    this.datasource.set(cache.datasource);
    this.datasize.set(cache.datasize);
    this.term = cache.text;
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
