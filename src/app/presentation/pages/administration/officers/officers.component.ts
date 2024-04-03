import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OfficerComponent } from './officer/officer.component';
import { WorkHistoryComponent } from './work-history/work-history.component';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Officer } from '../../../../domain/models';
import { SidenavButtonComponent, PaginatorComponent } from '../../../components';
import { OfficerService } from '../../../services/administration/officer.service';

interface PageProps {
  limit: number;
  index: number;
}
@Component({
  selector: 'app-officers',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    SidenavButtonComponent,
    PaginatorComponent,
  ],
  templateUrl: './officers.component.html',
  styleUrl: './officers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficersComponent {
  public length = signal<number>(10);
  public limit = signal<number>(10);
  public index = signal<number>(0);
  public offset = computed<number>(() => this.limit() * this.index());
  public dataSource = signal<Officer[]>([]);
  public displayedColumns = [
    'nombre',
    'dni',
    'cargo',
    'telefono',
    'activo',
    'options',
  ];
  public text: string = '';

  private officerService = inject(OfficerService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const subscription =
      this.text !== ''
        ? this.officerService.search(this.text, this.limit(), this.offset())
        : this.officerService.findAll(this.limit(), this.offset());
    subscription.subscribe((data) => {
      this.dataSource.set(data.officers);
      this.length.set(data.length);
    });
  }

  add() {
    const dialogRef = this.dialog.open(OfficerComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result: Officer) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.length.update((values) => values++);
    });
  }

  edit(officer: Officer) {
    const dialogRef = this.dialog.open(OfficerComponent, {
      width: '800px',
      data: officer,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((value) => value._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  delete(officer: Officer) {
    this.officerService.delete(officer._id).subscribe(({ activo }) => {
      this.dataSource.update((values) => {
        const index = values.findIndex((value) => value._id === officer._id);
        values[index].activo = activo;
        return [...values];
      });
    });
  }

  viewWorkHistory(officer: Officer) {
    this.dialog.open(WorkHistoryComponent, { width: '1000px', data: officer });
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
