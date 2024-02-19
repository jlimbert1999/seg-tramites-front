import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import {
  PaginatorComponent,
  SearchInputComponent,
  SidenavButtonComponent,
} from '../../../components';
import { Communication } from '../../../../domain/models';
import { AlertService, ArchiveService, CacheService } from '../../../services';
import { StateLabelPipe } from '../../../pipes';
import { MatButtonModule } from '@angular/material/button';

interface PaginationOptions {
  limit: number;
  index: number;
}

export interface CacheData {
  datasource: Communication[];
  datasize: number;
  text: string;
}

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    StateLabelPipe,
    PaginatorComponent,
    SidenavButtonComponent,
    SearchInputComponent,
  ],
  templateUrl: './archives.component.html',
  styleUrl: './archives.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchivesComponent implements OnInit {
  private archiveService = inject(ArchiveService);
  private cacheService = inject(CacheService);
  private alertService = inject(AlertService);

  public displayedColumns: string[] = [
    'code',
    'manager',
    'reference',
    'date',
    'options',
  ];
  public datasource = signal<Communication[]>([]);
  public datasize = signal<number>(0);
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
    const subscription =
      this.term !== ''
        ? this.archiveService.search(this.term, this.limit, this.offset)
        : this.archiveService.findAll(this.limit, this.offset);
    subscription.subscribe((data) => {
      this.datasource.set(data.mails);
      this.datasize.set(data.length);
    });
  }

  applyFilter(term: string) {
    this.cacheService.pageIndex.set(0);
    this.term = term;
    this.getData();
  }

  changePage({ limit, index }: PaginationOptions) {
    this.cacheService.pageSize.set(limit);
    this.cacheService.pageIndex.set(index);
    this.getData();
  }

  unarchive({ _id, procedure }: Communication) {
    this.alertService.QuestionAlert({
      title: `¿Desarchivar el tramite ${procedure.code}?`,
      text: 'El tramite volvera a su bandeja de entrada',
      callback: () => {
        this.archiveService.unarchiveCommunication(_id).subscribe(() => {
          this.removeItemDataSource(_id);
        });
      },
    });
  }

  private removeItemDataSource(id_mail: string) {
    this.datasize.update((length) => (length -= 1));
    this.datasource.update((values) => {
      values = values.filter((el) => el._id !== id_mail);
      return [...values];
    });
  }

  private savePaginationData(): void {
    this.cacheService.resetPagination();
    const cache: CacheData = {
      datasource: this.datasource(),
      datasize: this.datasize(),
      text: this.term,
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
    this.term = cache.text;
  }

  get limit() {
    return this.cacheService.pageSize();
  }
  get index() {
    return this.cacheService.pageIndex();
  }
  get offset() {
    return this.cacheService.pageOffset();
  }
}
