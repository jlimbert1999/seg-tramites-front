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
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { SidenavButtonComponent } from '../../components/sidenav-button/sidenav-button.component';
import { TypeProcedureComponent } from './type-procedure/type-procedure.component';
import { TypeProcedureService } from './services/type-procedure.service';
import { typeProcedureResponse } from '../../../infraestructure/interfaces';

interface PageProps {
  limit: number;
  index: number;
}
@Component({
  selector: 'app-types-procedures',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './types-procedures.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypesProceduresComponent {
  public dataSource = signal<typeProcedureResponse[]>([]);
  public displayedColumns = ['nombre', 'segmento', 'activo', 'menu'];
  public length = signal<number>(10);
  public limit = signal<number>(10);
  public index = signal<number>(0);
  public offset = computed<number>(() => this.limit() * this.index());
  term: string = '';

  private dialog = inject(MatDialog);
  private typeService = inject(TypeProcedureService);

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const subscription =
      this.term !== ''
        ? this.typeService.search(this.term, this.limit(), this.offset())
        : this.typeService.findAll(this.limit(), this.offset());
    subscription.subscribe((data) => {
      this.dataSource.set(data.types);
      this.length.set(data.length);
    });
  }

  add() {
    const dialogRef = this.dialog.open(TypeProcedureComponent, {
      width: '1200px',
    });
    dialogRef.afterClosed().subscribe((result: typeProcedureResponse) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.length.update((values) => values++);
    });
  }

  edit(type: typeProcedureResponse) {
    const dialogRef = this.dialog.open(TypeProcedureComponent, {
      width: '1200px',
      data: type,
    });
    dialogRef.afterClosed().subscribe((result: typeProcedureResponse) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((value) => value._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  toggleStatus(type: typeProcedureResponse) {
    this.typeService.delete(type._id).subscribe(({ activo }) => {
      this.dataSource.update((values) => {
        const index = values.findIndex((value) => value._id === type._id);
        values[index].activo = activo;
        return [...values];
      });
    });
  }

  applyFilter(event: Event) {
    this.index.set(0);
    this.term = (event.target as HTMLInputElement).value;
    this.getData();
  }
  cancelSearch() {
    this.index.set(0);
    this.term = '';
    this.getData();
  }
  onPageChage({ limit, index }: PageProps) {
    this.limit.set(limit);
    this.index.set(index);
    this.getData();
  }
}
