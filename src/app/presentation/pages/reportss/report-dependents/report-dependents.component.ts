import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { PdfService, ReportService } from '../../../services';
interface dependents {
  id: string;
  officer?: {
    fullname: string;
    jobtitle: string;
  };
  pendings: number;
}
@Component({
  selector: 'app-report-dependents',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './report-dependents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportDependentsComponent implements OnInit {
  private reportService = inject(ReportService);
  private pdfService = inject(PdfService);

  dependents = signal<dependents[]>([]);

  ngOnInit(): void {
    this.reportService.getPendingsByUnit().subscribe((data) => {
      this.dependents.set(data);
    });
  }

  getInbox(id_acoun: string) {
    this.reportService.getPendingsByAccount(id_acoun).subscribe((data) => {
      this.pdfService.GenerateReportSheet(
        'reporte',
        {},
        data,
        [{ columnDef: 'reference', header: 'Referncia' }],
      );
    });
  }
}
