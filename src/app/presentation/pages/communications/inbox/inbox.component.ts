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
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  AlertService,
  CacheService,
  InboxService,
  SocketService,
} from '../../../services';
import {
  PaginatorComponent,
  SearchInputComponent,
  SidenavButtonComponent,
} from '../../../components';
import { Communication, StatusMail } from '../../../../domain/models';
import { StateLabelPipe } from '../../../pipes';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface PaginationOptions {
  limit: number;
  index: number;
}
interface CacheData {
  datasource: Communication[];
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
  private cacheService: CacheService<CacheData> = inject(CacheService);
  private socketService = inject(SocketService);
  private destroyRef = inject(DestroyRef);
  private alertService = inject(AlertService);

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

  get index() {
    return this.cacheService.pageIndex();
  }
  get limit() {
    return this.cacheService.pageSize();
  }
  get offset() {
    return this.cacheService.pageOffset();
  }

  get PageParams(): { limit: number; index: number } {
    return { limit: this.limit, index: this.index };
  }

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

  private listenProcedureDispatches() {
    this.socketService
      .listenProceduresDispatches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((communication) => {
        this.datasource.update((values) => {
          if (values.length === this.limit) values.pop();
          return [communication, ...values];
        });
      });
  }

  private listenCacelDispatches() {
    this.socketService
      .listenCancelDispatches()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((id) => {
        // TODO DELETE ITEM OF DATASOURCE
      });
  }
}
