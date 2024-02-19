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
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { InstitutionService } from './services/institution.service';
import { InstitutionComponent } from './institution/institution.component';
import { institutionResponse } from '../../../../infraestructure/interfaces';
import { SidenavButtonComponent, PaginatorComponent } from '../../../components';

interface PageProps {
  limit: number;
  index: number;
}
@Component({
  selector: 'app-institutions',
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
    PaginatorComponent,
  ],
  templateUrl: './institutions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsComponent {
  dialog = inject(MatDialog);
  dataSource = signal<institutionResponse[]>([]);
  institutionService = inject(InstitutionService);
  public text: string = '';
  public displayedColumns: string[] = ['sigla', 'nombre', 'situacion', 'menu'];
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
        ? this.institutionService.search(this.text, this.limit(), this.offset())
        : this.institutionService.get(this.limit(), this.offset());
    subscription.subscribe((data) => {
      this.dataSource.set(data.institutions);
      this.length.set(data.length);
    });
  }

  add() {
    const dialogRef = this.dialog.open(InstitutionComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((result?: institutionResponse) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.length.update((value) => value++);
    });
  }

  edit(data: institutionResponse) {
    const dialogRef = this.dialog.open(InstitutionComponent, {
      width: '700px',
      data,
    });
    dialogRef.afterClosed().subscribe((result: institutionResponse) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((inst) => inst._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  changeStatus(data: institutionResponse) {
    this.institutionService.delete(data._id).subscribe((newState) => {
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
