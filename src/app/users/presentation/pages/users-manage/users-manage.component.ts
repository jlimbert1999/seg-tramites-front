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
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { user } from '../../../infrastructure';
import { UserService } from '../../services';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-users-manage',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersManageComponent implements OnInit {
  private userService = inject(UserService);
  readonly dialogRef = inject(MatDialog);

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

  create() {
    const dialogRef = this.dialogRef.open(UserDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => [result, ...values]);
      this.datasize.update((value) => (value += 1));
    });
  }

  update(user: any) {
    const dialogRef = this.dialogRef.open(UserDialogComponent, {
      width: '600px',
      data: user,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((value) => value._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }
}
