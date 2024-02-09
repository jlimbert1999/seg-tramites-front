import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { DependencyComponent } from './dependency/dependency.component';
import {
  PaginatorComponent,
  SidenavButtonComponent,
} from '../../../components';
import { dependencyResponse } from '../../../../infraestructure/interfaces';
import { DependencyService } from '../../../services';

interface PageProps {
  limit: number;
  index: number;
}
@Component({
  selector: 'app-dependencies',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    PaginatorComponent,
    SidenavButtonComponent,
  ],
  templateUrl: './dependencies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependenciesComponent {
  private dialog = inject(MatDialog);
  private dependencyService = inject(DependencyService);

  text: string = '';
  dataSource = signal<dependencyResponse[]>([]);
  readonly displayedColumns = [
    'sigla',
    'nombre',
    'codigo',
    'institucion',
    'activo',
    'menu',
  ];
  public length = signal<number>(10);
  public limit = signal<number>(10);
  public index = signal<number>(0);
  public offset = computed<number>(() => this.limit() * this.index());

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    const subscription =
      this.text !== ''
        ? this.dependencyService.search(this.text, this.limit(), this.offset())
        : this.dependencyService.findAll(this.limit(), this.offset());
    subscription.subscribe((data) => {
      this.dataSource.set(data.dependencies);
      this.length.set(data.length);
    });
  }

  add() {
    const dialogRef = this.dialog.open(DependencyComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result: dependencyResponse) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.length.update((values) => values++);
    });
  }

  edit(data: dependencyResponse) {
    const dialogRef = this.dialog.open(DependencyComponent, {
      width: '900px',
      data,
    });
    dialogRef.afterClosed().subscribe((dependency: dependencyResponse) => {
      if (!dependency) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((inst) => inst._id === dependency._id);
        values[index] = dependency;
        return [...values];
      });
    });
  }

  changeStatus(data: dependencyResponse) {
    this.dependencyService.delete(data._id).subscribe((newState) => {
      this.dataSource.update((values) => {
        const index = values.findIndex((inst) => inst._id === data._id);
        values[index].activo = newState.activo;
        return [...values];
      });
    });
  }

  applyFilter() {
    this.index.set(0);
    this.getData();
  }

  cancelSearch() {
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
