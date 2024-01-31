import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { SidenavButtonComponent } from '../../components/sidenav-button/sidenav-button.component';
import { jobResponse } from './interfaces/job-response.interface';
import { JobService } from './services/job.service';
import { JobComponent } from './job/job.component';

interface PageProps {
  limit: number;
  index: number;
}
@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTableModule,
    MatIconModule,
    SidenavButtonComponent,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    PaginatorComponent,
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent implements OnInit {
  private jobService = inject(JobService);
  private dialog = inject(MatDialog);

  public length = signal<number>(10);
  public limit = signal<number>(10);
  public index = signal<number>(0);
  public offset = computed<number>(() => this.limit() * this.index());
  public text: string = '';
  public dataSource = signal<jobResponse[]>([]);
  public displayedColumns = ['name', 'options'];

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const supscription =
      this.text !== ''
        ? this.jobService.search(this.text, this.limit(), this.offset())
        : this.jobService.findAll(this.limit(), this.offset());
    supscription.subscribe((data) => {
      this.dataSource.set(data.jobs);
      this.length.set(data.length);
    });
  }

  edit(item: jobResponse) {
    const dialogRef = this.dialog.open(JobComponent, {
      width: '800px',
      data: item,
    });
    dialogRef.afterClosed().subscribe((result?: jobResponse) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((element) => element._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  add() {
    const dialogRef = this.dialog.open(JobComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result?: jobResponse) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.length.update((value) => value++);
    });
  }

  applyFilter() {
    this.index.set(0);
    this.getData();
  }

  cancelFilter() {
    this.text = '';
    this.index.set(0);
    this.getData();
  }

  onPageChage({ limit, index }: PageProps) {
    this.limit.set(limit);
    this.index.set(index);
    this.getData();
  }
}
