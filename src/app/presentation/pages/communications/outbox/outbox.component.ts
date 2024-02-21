import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import {
  SidenavButtonComponent,
  PaginatorComponent,
  SearchInputComponent,
} from '../../../components';
import {
  AlertService,
  CacheService,
  OutboxService,
  PdfService,
  ProcedureService,
} from '../../../services';
import { GroupedCommunication } from '../../../../domain/models';
import { StateLabelPipe } from '../../../pipes';
import { forkJoin } from 'rxjs';

interface PaginationOptions {
  limit: number;
  index: number;
}
interface CacheData {
  results: GroupedCommunication[];
  length: number;
  term: string;
}
@Component({
  selector: 'app-outbox',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    PaginatorComponent,
    SidenavButtonComponent,
    SearchInputComponent,
    StateLabelPipe,
  ],
  templateUrl: './outbox.component.html',
  styleUrl: './outbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class OutboxComponent {
  private alertService = inject(AlertService);
  private outboxService = inject(OutboxService);
  private procedureService = inject(ProcedureService);
  private pdfService = inject(PdfService);
  private cacheService: CacheService<CacheData> = inject(CacheService);

  public displayedColumns = [
    'code',
    'reference',
    'state',
    'startDate',
    'expand',
    'menu-options',
  ];
  public datasource = signal<GroupedCommunication[]>([]);
  public datasize = signal<number>(0);
  public expandedElement: GroupedCommunication | null = null;
  public term: string = '';

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.savePaginationData();
    });
  }

  ngOnInit(): void {
    this.loadPaginationData();
  }

  getData() {
    const observable = this.term
      ? this.outboxService.search(this.limit, this.offset, this.term)
      : this.outboxService.findAll(this.limit, this.offset);
    observable.subscribe((data) => {
      this.datasource.set(data.mails);
      this.datasize.set(data.length);
    });
  }

  applyFilter(term: string) {
    this.term = term;
    this.cacheService.pageIndex.set(0);
    this.getData();
  }

  cancelMails(id_procedure: string, ids: string[], date: Date) {
    this.outboxService.cancelMails(id_procedure, ids).subscribe((resp) => {
      this.removeElementDatasource(date, ids);
      this.alertService.Alert({
        icon: 'success',
        title: 'Envios cancelados',
        text: resp.message,
      });
    });
  }

  cancelAll(communication: GroupedCommunication) {
    const ids = communication.dispatches.map((item) => item._id);
    this.alertService.QuestionAlert({
      title: `¿Cancelar remision del tramite ${communication.procedure.code}?`,
      text: `Envios a cancelar: ${ids.length}`,
      callback: () => {
        this.cancelMails(communication.procedure._id, ids, communication.date);
      },
    });
  }

  cancelSelected(ids: string[] | null, communication: GroupedCommunication) {
    if (!ids) return;
    if (ids.length === 0) return;
    this.alertService.QuestionAlert({
      title: `¿Cancelar remision del tramtie ${communication.procedure.code}?`,
      text: `Envios a cancelar: ${ids.length}`,
      callback: () => {
        this.cancelMails(communication.procedure._id, ids, communication.date);
      },
    });
  }

  generateRouteMap({ procedure }: GroupedCommunication) {
    forkJoin([
      this.procedureService.getDetail(procedure._id, procedure.group),
      this.procedureService.getWorkflow(procedure._id),
    ]).subscribe((resp) => {
      this.pdfService.generateRouteSheet(resp[0], resp[1]);
    });
  }

  private removeElementDatasource(outboundDate: Date, ids: string[]) {
    this.datasource.update((values) => {
      const index = values.findIndex((item) => item.date === outboundDate);
      const filteredDispatches = values[index].dispatches.filter(
        (mail) => !ids.includes(mail._id)
      );
      values[index].dispatches = filteredDispatches;
      if (filteredDispatches.length === 0) {
        this.datasize.update((length) => (length -= 1));
        values.splice(index, 1);
      }
      return [...values];
    });
  }

  private savePaginationData(): void {
    this.cacheService.resetPagination();
    const cache: CacheData = {
      results: this.datasource(),
      length: this.datasize(),
      term: this.term,
    };
    this.cacheService.save('outbox', cache);
  }

  private loadPaginationData(): void {
    const cacheData = this.cacheService.load('outbox');
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
}
