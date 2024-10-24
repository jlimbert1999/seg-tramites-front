import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { Communication, StatusMail, StateProcedure } from '../../../../domain/models';
import { transferDetails } from '../../../../infraestructure/interfaces';
import { MaterialModule } from '../../../../material.module';
import { PaginatorComponent, SidenavButtonComponent, DispatcherComponent } from '../../../../presentation/components';
import { StateLabelPipe } from '../../../../presentation/pipes';
import { InboxService, SocketService, AlertService, ProcedureService, PdfService, ArchiveService, CacheService } from '../../../../presentation/services';
import { SearchInputComponent } from '../../../../shared';



export interface InboxCache {
  datasource: Communication[];
  datasize: number;
  status?: StatusMail;
  text: string;
}
@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MaterialModule,
    PaginatorComponent,
    SearchInputComponent,
    SidenavButtonComponent,
    StateLabelPipe,
  ],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InboxComponent implements OnInit {
  private inboxService = inject(InboxService);
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private alertService = inject(AlertService);
  private dialog = inject(MatDialog);
  private procedureService = inject(ProcedureService);
  private pdfService = inject(PdfService);
  private archiveService = inject(ArchiveService);
  private cacheService: CacheService<InboxCache> = inject(CacheService);

  public displayedColumns: string[] = [
    'group',
    'code',
    'reference',
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
      this.saveCache();
    });
  }
  ngOnInit(): void {
    this.listenProcedureDispatches();
    this.listenCancelDispatches();
    this.loadCache();
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

  changePage(params: { limit: number; index: number }) {
    this.cacheService.pageSize.set(params.limit);
    this.cacheService.pageIndex.set(params.index);
    this.getData();
  }

  accept({ _id, procedure }: Communication) {
    this.alertService.QuestionAlert({
      title: `¿Aceptar tramite ${procedure.code}?`,
      text: 'Solo debe aceptar tramites que haya recibido en fisico',
      callback: () => {
        this.inboxService.accept(_id).subscribe(() => {
          this.datasource.update((values) => {
            const index = values.findIndex((el) => el._id === _id);
            values[index].status = StatusMail.Received;
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
    const dialogRef = this.dialog.open(DispatcherComponent, {
      maxWidth: '1200px',
      width: '1200px',
      data: detail,
    });
    dialogRef.afterClosed().subscribe((message: string) => {
      if (!message) return;
      this.removeItemDataSource(_id);
    });
  }

  archive(
    { _id, procedure }: Communication,
    state: StateProcedure.Concluido | StateProcedure.Suspendido
  ) {
    this.alertService.ConfirmAlert({
      title: `¿${
        state === StateProcedure.Concluido ? 'Concluir' : 'Suspender'
      } el tramite ${procedure.code}?`,
      text: 'El tramite pasara a su seccion de archivos',
      callback: (description) => {
        this.archiveService.create(_id, description, state).subscribe(() => {
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

  get StateProcedure() {
    return StateProcedure;
  }

  private saveCache(): void {
    this.cacheService.resetPagination();
    const cache: InboxCache = {
      datasource: this.datasource(),
      datasize: this.datasize(),
      text: this.term,
      status: this.status,
    };
    this.cacheService.save('inbox', cache);
  }

  private loadCache(): void {
    const cache = this.cacheService.load('inbox');
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

  private listenCancelDispatches() {
    this.socketService
      .listenCancelDispatches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => this.removeItemDataSource(id));
  }

  private removeItemDataSource(id: string) {
    this.datasize.update((length) => (length -= 1));
    this.datasource.update((values) => values.filter((el) => el._id !== id));
  }
}
