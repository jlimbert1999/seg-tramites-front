import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { InstitutionService } from './services/institution.service';
import { InstitutionComponent } from './institution/institution.component';
import { institutionResponse } from '../../../../infraestructure/interfaces';
import {
  SidenavButtonComponent,
  PaginatorComponent,
} from '../../../components';
import { MaterialModule } from '../../../../material.module';

interface PageProps {
  limit: number;
  index: number;
}
@Component({
  selector: 'app-institutions',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    SidenavButtonComponent,
    FormsModule,
    PaginatorComponent,
  ],
  templateUrl: './institutions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    td.mat-column-buttons {
      width: 150px;
    }
  
  `,
})
export class InstitutionsComponent {
  dialog = inject(MatDialog);
  dataSource = signal<institutionResponse[]>([]);
  institutionService = inject(InstitutionService);

  public text: string = '';
  public displayedColumns: string[] = [
    'sigla',
    'nombre',
    'situacion',
    'buttons',
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
        ? this.institutionService.search(this.text, this.limit(), this.offset())
        : this.institutionService.get(this.limit(), this.offset());
    subscription.subscribe((data) => {
      this.dataSource.set(data.institutions);
      this.length.set(data.length);
    });
  }

  add() {
    const dialogRef = this.dialog.open(InstitutionComponent, {
      maxWidth: '700px',
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((result?: institutionResponse) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.length.update((value) => (value += 1));
    });
  }

  edit(data: institutionResponse) {
    const dialogRef = this.dialog.open(InstitutionComponent, {
      maxWidth: '700px',
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
