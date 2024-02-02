import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ExternalService } from '../../services/external.service';
import { ExternalProcedure } from '../../models';
import { CacheService } from '../../../../services/cache.service';
import { PaginatorComponent } from '../../../../components';
import { StateLabelPipe } from '../../pipes/state-label.pipe';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { ExternalProcedureDto } from '../../dtos';

interface PaginationOptions {
  limit: number;
  index: number;
}
interface CacheData {
  data: ExternalProcedure[];
  text: string;
  length: number;
}
@Component({
  selector: 'app-external',
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
    StateLabelPipe,
    SearchInputComponent,
  ],
  templateUrl: './external.component.html',
  styleUrl: './external.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalComponent {
  private dialog = inject(MatDialog);
  private externalService = inject(ExternalService);
  private cacheService: CacheService<CacheData> = inject(CacheService);
  private destroyref = inject(DestroyRef).onDestroy(() => {
    this.savePaginationData();
  });
  public term: string = '';

  datasource = signal<ExternalProcedure[]>([]);
  displayedColumns: string[] = [
    'code',
    'reference',
    'applicant',
    'state',
    'startDate',
    'send',
    'menu-options',
  ];

  ngOnInit(): void {
    this.loadPaginationData();
  }

  getData() {
    console.log('GET DATA FROM SERVER');
    const subscription = this.term
      ? this.externalService.search(this.term, this.limit, this.offset)
      : this.externalService.findAll(this.limit, this.offset);
    subscription.subscribe((data) => {
      this.datasource.set(data.procedures);
      this.cacheService.dataLength.set(data.length);
    });
  }

  applyFilter(term: string) {
    this.cacheService.pageIndex.set(0);
    this.term = term;
    this.getData();
  }

  add() {
    // const dialogRef = this.dialog.open<
    //   RegisterExternalComponent,
    //   undefined,
    //   ExternalProcedure
    // >(RegisterExternalComponent, {
    //   width: '1000px',
    //   disableClose: true,
    // });
    // dialogRef.afterClosed().subscribe((createdProcedure) => {
    //   if (!createdProcedure) return;
    //   this.paginatorService.length++;
    //   this.dataSource.update((values) => {
    //     if (this.dataSource.length === this.paginatorService.limit)
    //       values.pop();
    //     return [createdProcedure, ...values];
    //   });
    //   this.send(createdProcedure);
    // });
  }

  edit(procedure: ExternalProcedure) {
    // const dialogRef = this.dialog.open<
    //   RegisterExternalComponent,
    //   ExternalProcedure,
    //   ExternalProcedure
    // >(RegisterExternalComponent, {
    //   width: '1000px',
    //   data: procedure,
    //   disableClose: true,
    // });
    // dialogRef.afterClosed().subscribe((updatedProcedure) => {
    //   if (!updatedProcedure) return;
    //   this.dataSource.update((values) => {
    //     const indexFound = values.findIndex(
    //       (element) => element._id === updatedProcedure._id
    //     );
    //     values[indexFound] = updatedProcedure;
    //     return [...values];
    //   });
    // });
  }

  send(procedure: ExternalProcedure) {
    // const dialogRef = this.dialog.open<
    //   SendDialogComponent,
    //   TransferDetails,
    //   string
    // >(SendDialogComponent, {
    //   width: '1200px',
    //   data: {
    //     id_procedure: procedure._id,
    //     attachmentQuantity: procedure.amount,
    //     code: procedure.code,
    //   },
    //   disableClose: true,
    // });
    // dialogRef.afterClosed().subscribe((message) => {
    //   if (!message) return;
    //   this.dataSource.update((values) => {
    //     const indexFound = values.findIndex(
    //       (element) => element._id === procedure._id
    //     );
    //     values[indexFound].isSend = true;
    //     return [...values];
    //   });
    // });
  }

  generateRouteMap(id_procedure: string, group: any) {
    // this.procedureService
    //   .getFullProcedure(id_procedure, group)
    //   .subscribe((data) => {
    //     this.pdf.generateRouteSheet(data.procedure, data.workflow);
    //   });
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
    this.cacheService.storage[this.constructor.name] = {
      data: this.datasource(),
      text: this.term,
      length: this.cacheService.dataLength(),
    };
    this.cacheService.keepAliveData.set(false);
  }

  private loadPaginationData(): void {
    const cacheData = this.cacheService.storage[this.constructor.name];
    if (!this.cacheService.keepAliveData() || !cacheData) {
      console.log('si');
      this.getData();
      return;
    }
    this.datasource.set(cacheData.data);
    this.term = cacheData.text;
    this.cacheService.dataLength.set(cacheData.length);
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
  get length() {
    return this.cacheService.dataLength();
  }

  get PageParam(): { limit: number; index: number } {
    return { limit: this.limit, index: this.index };
  }
}
