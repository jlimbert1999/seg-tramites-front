import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AlertService,
  ArchiveService,
  CacheService,
  InboxService,
  PdfService,
  ProcedureService,
  SocketService,
} from '../../../services';
import {
  PaginatorComponent,
  SearchInputComponent,
  SidenavButtonComponent,
} from '../../../components';
import {
  Communication,
  StateProcedure,
  StatusMail,
} from '../../../../domain/models';
import { StateLabelPipe } from '../../../pipes';
import { transferDetails } from '../../../../infraestructure/interfaces';
import { ProcedureDispatcherComponent } from './procedure-dispatcher/procedure-dispatcher.component';
import { forkJoin } from 'rxjs';

interface PaginationOptions {
  limit: number;
  index: number;
}
export interface InboxCacheData {
  datasource: Communication[];
  status?: StatusMail;
  datasize: number;
  text: string;
}
@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    SidenavButtonComponent,
    PaginatorComponent,
    SearchInputComponent,
    StateLabelPipe,
  ],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent implements OnInit {
  private inboxService = inject(InboxService);
  private cacheService: CacheService<InboxCacheData> = inject(CacheService);
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private alertService = inject(AlertService);
  private dialog = inject(MatDialog);
  private procedureService = inject(ProcedureService);
  private pdfService = inject(PdfService);
  private archiveService = inject(ArchiveService);

  public displayedColumns: string[] = [
    'group',
    'code',
    'reference',
    'state',
    'emitter',
    'outboundDate',
    'options',
  ];
  public datasize = signal<number>(0);
  public datasource = signal<Communication[]>([]);
  public term: string = '';
  public status?: StatusMail;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.savePaginationData();
    });
  }
  ngOnInit(): void {
    this.listenProcedureDispatches();
    this.listenCacelDispatches();
    this.loadPaginationData();
  }

  getData(): void {
    const observable =
      this.term !== ''
        ? this.inboxService.search({
            limit: this.limit,
            offset: this.offset,
            text: this.term,
            status: this.status,
          })
        : this.inboxService.findAll(this.limit, this.offset, this.status);
    observable.subscribe((data) => {
      this.datasource.set(data.mails);
      this.datasize.set(data.length);
    });
  }

  applyStatusFilter(status: StatusMail): void {
    this.cacheService.pageIndex.set(0);
    this.status = status;
    this.getData();
  }

  applyTextFilter(term: string): void {
    this.cacheService.pageIndex.set(0);
    this.term = term;
    this.getData();
  }

  changePage({ limit, index }: PaginationOptions) {
    this.cacheService.pageSize.set(limit);
    this.cacheService.pageIndex.set(index);
    this.getData();
  }

  accept({ _id, procedure }: Communication) {
    this.alertService.QuestionAlert({
      title: `Aceptar tramite ${procedure.code}?`,
      text: 'Solo debe aceptar tramites que haya recibido en fisico',
      callback: () => {
        this.inboxService.accept(_id).subscribe((resp) => {
          this.datasource.update((values) => {
            const index = values.findIndex((el) => el._id === _id);
            values[index].status = StatusMail.Received;
            values[index].procedure.state = resp.state;
            return [...values];
          });
        });
      },
    });
  }

  reject({ _id, procedure }: Communication) {
    this.alertService.ConfirmAlert({
      title: `¿Rechazar tramite ${procedure.code}?`,
      text: 'El tramite sera devuelto al funcionario emisor',
      callback: (descripion) => {
        this.inboxService.reject(_id, descripion).subscribe(() => {
          this.removeItemDataSource(_id);
        });
      },
    });
  }

  send({ _id, procedure, attachmentQuantity }: Communication) {
    const detail: transferDetails = {
      id_mail: _id,
      id_procedure: procedure._id,
      code: procedure.code,
      attachmentQuantity: attachmentQuantity,
    };
    const dialogRef = this.dialog.open(ProcedureDispatcherComponent, {
      width: '1200px',
      data: detail,
    });
    dialogRef.afterClosed().subscribe((message) => {
      if (!message) return;
      this.datasize.update((length) => (length -= 1));
      this.datasource.update((values) => values.filter((el) => el._id !== _id));
    });
  }

  archive({ _id, procedure }: Communication) {
    this.alertService.ConfirmAlert({
      title: `¿Concluir el tramite ${procedure.code}?`,
      text: 'Concluir indica que no hay más acciones pendientes',
      callback: (description) => {
        this.archiveService
          .archiveCommunication(_id, {
            description: description,
            state: StateProcedure.Concluido,
          })
          .subscribe(() => {
            this.removeItemDataSource(_id);
          });
      },
    });
  }

  suspend({ _id, procedure }: Communication) {
    this.alertService.ConfirmAlert({
      title: `¿Suspender el tramite ${procedure.code}?`,
      text: 'Suspender detiene temporalmente el proceso',
      callback: (description) => {
        this.archiveService
          .archiveCommunication(_id, {
            description: description,
            state: StateProcedure.Suspendido,
          })
          .subscribe(() => {
            this.removeItemDataSource(_id);
          });
      },
    });
  }

  generateRouteMap({ procedure }: Communication) {
    forkJoin([
      this.procedureService.getDetail(procedure._id, procedure.group),
      this.procedureService.getWorkflow(procedure._id),
    ]).subscribe((resp) => {
      this.pdfService.generateRouteSheet(resp[0], resp[1]);
    });
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

  private savePaginationData(): void {
    this.cacheService.resetPagination();
    const cache: InboxCacheData = {
      datasource: this.datasource(),
      datasize: this.datasize(),
      text: this.term,
      status: this.status,
    };
    this.cacheService.storage[this.constructor.name] = cache;
  }

  private loadPaginationData(): void {
    const cache = this.cacheService.storage[this.constructor.name];
    if (!this.cacheService.keepAliveData() || !cache) {
      this.getData();
      return;
    }
    this.datasource.set(cache.datasource);
    this.datasize.set(cache.datasize);
    this.status = cache.status;
    this.term = cache.text;
  }

  private listenProcedureDispatches() {
    this.socketService
      .listenProceduresDispatches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((communication) => {
        this.datasource.update((values) => {
          if (values.length === this.limit) values.pop();
          return [communication, ...values];
        });
        this.datasize.update((length) => (length += 1));
      });
  }

  private listenCacelDispatches() {
    this.socketService
      .listenCancelDispatches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.removeItemDataSource(id));
  }

  private removeItemDataSource(id_mail: string) {
    this.datasize.update((length) => (length -= 1));
    this.datasource.update((values) => {
      values = values.filter((el) => el._id !== id_mail);
      return [...values];
    });
  }
}
