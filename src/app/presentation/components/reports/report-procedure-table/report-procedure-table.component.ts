import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { reportProcedureData } from '../../../../infraestructure/interfaces';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { StateLabelPipe } from '../../../pipes';

export interface ProcedureTableColumns {
  columnDef: string;
  header: string;
}

@Component({
  selector: 'report-procedure-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    MatTableModule,
    StateLabelPipe,
  ],
  templateUrl: './report-procedure-table.component.html',
  styles: `
  .mat-mdc-cell {
  font-size: 12px;
}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportProcedureTableComponent {
  public displayedColumns: string[] = [];
  public columns: ProcedureTableColumns[] = [];
  @Input() datasource = signal<reportProcedureData[]>([]);
  @Input() set colums(values: ProcedureTableColumns[]) {
    this.columns = values;
    this.displayedColumns = values.map(({ columnDef }) => columnDef);
  }
  @Output() onNavigate = new EventEmitter<reportProcedureData>();

  constructor() {}

  navigate(element: reportProcedureData) {
    this.onNavigate.emit(element);
  }
}
