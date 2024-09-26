import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { user } from '../../../infrastructure';
import { UserService } from '../../services';

@Component({
  selector: 'app-users-manage',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersManageComponent implements OnInit {
  private userService = inject(UserService);

  datasource = signal<user[]>([]);
  datasize = signal(0);

  limit = signal(10);
  index = signal(0);
  offset = computed(() => this.limit() * this.index());
  term = signal<string>('');

  displayedColumns: string[] = ['login', 'fullname', 'status', 'options'];

  ngOnInit(): void {
    this.getData();
  }

  onPageChange(event: PageEvent) {
    this.limit.set(event.pageSize);
    this.index.set(event.pageIndex);
    this.getData();
  }

  getData() {
    this.userService
      .findAll(this.limit(), this.offset())
      .subscribe(({ users, length }) => {
        this.datasource.set(users);
        this.datasize.set(length);
      });
  }
}
