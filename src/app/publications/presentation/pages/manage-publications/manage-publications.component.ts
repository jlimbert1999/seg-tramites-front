import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { PostService } from '../../services/post.service';
import { publication } from '../../../infrastructure';

import { PublicationDialogComponent } from './publication-dialog/publication-dialog.component';
import { SearchInputComponent } from '../../../../shared';
import { AlertService } from '../../../../presentation/services';

@Component({
  selector: 'app-manage-publications',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatMenuModule,
    SearchInputComponent,
  ],
  templateUrl: './manage-publications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ManagePublicationsComponent implements OnInit {
  private publicationService = inject(PostService);
  private alertService = inject(AlertService);
  readonly dialogRef = inject(MatDialog);

  datasource = signal<publication[]>([]);
  datasize = signal<number>(0);
  displayedColumns: string[] = ['title', 'priority', 'expiration', 'options'];

  term = signal<string>('');
  public limit = signal<number>(10);
  public index = signal<number>(0);
  public offset = computed<number>(() => this.limit() * this.index());
  
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.publicationService
      .findByUser()
      .subscribe(({ publications, length }) => {
        this.datasource.set(publications);
        this.datasize.set(length);
      });
  }

  create(): void {
    const dialogRef = this.dialogRef.open(PublicationDialogComponent, {
      minWidth: '800px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.datasource.update((values) => [result, ...values]);
    });
  }

  update(publication: publication): void {
    const dialogRef = this.dialogRef.open(PublicationDialogComponent, {
      minWidth: '800px',
      data: { ...publication },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result: publication) => {
      if (!result) return;
      this.datasource.update((values) => {
        const index = values.findIndex((el) => el._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  delete(publication: publication) {
    this.alertService.QuestionAlert({
      title: `¿Eliminar Comunicado?`,
      text: 'Esta accion no se puede deshacer',
      callback: () => {
        this.publicationService.delete(publication._id).subscribe(() => {
          this.datasource.update((values) =>
            values.filter(({ _id }) => _id !== publication._id)
          );
          this.datasize.update((value) => (value -= 1));
        });
      },
    });
  }

  search(term: string) {
    this.index.set(0);
    this.term.set(term);
    this.getData();
  }

  onPageChange({ pageIndex, pageSize }: PageEvent) {
    this.limit.set(pageSize);
    this.index.set(pageIndex);
    this.getData();
  }
}
