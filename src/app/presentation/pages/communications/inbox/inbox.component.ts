import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { CacheService, InboxService } from '../../../services';
import {
  PaginatorComponent,
  SearchInputComponent,
  SidenavButtonComponent,
} from '../../../components';
import { Communication, StatusMail } from '../../../../domain/models';
import { FormsModule } from '@angular/forms';

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
    MatMenuModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatToolbarModule,
    SidenavButtonComponent,
    PaginatorComponent,
    SearchInputComponent,
  ],
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent implements OnInit {
  private inboxService = inject(InboxService);
  private cacheService = inject(CacheService);
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

  ngOnInit(): void {
    this.getData();
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
}
