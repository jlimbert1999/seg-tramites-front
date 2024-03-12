import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin, switchMap } from 'rxjs';
import {
  ExternalProcedure,
  GroupProcedure,
  InternalProcedure,
  Workflow,
} from '../../../../domain/models';
import {
  ExternalDetailComponent,
  InternalDetailComponent,
  GraphWorkflowComponent,
  ListWorkflowComponent,
  ListObservationsComponent,
} from '../../../components';
import { CacheService, PdfService, ProcedureService } from '../../../services';
import { observationResponse } from '../../../../infraestructure/interfaces';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    ExternalDetailComponent,
    InternalDetailComponent,
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ListObservationsComponent,
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements OnInit {
  private _location = inject(Location);
  private route = inject(ActivatedRoute);
  private cacheService = inject(CacheService);
  private procedureService = inject(ProcedureService);
  private pdfService = inject(PdfService);

  public procedure = signal<ExternalProcedure | InternalProcedure | null>(null);
  public workflow = signal<Workflow[]>([]);
  public observations = signal<observationResponse[]>([]);

  parentEmitter = new EventEmitter<void>();

  id_procedure!: string;
  group!: GroupProcedure;

  ngOnInit(): void {
    this.route.params.subscribe(({ group, id }) => {
      this.id_procedure = id;
      this.group = group;
    });
  }
  backLocation() {
    this.route.queryParams.subscribe((data) => {
      this.cacheService.pageSize.set(data['limit'] ?? 10);
      this.cacheService.pageIndex.set(data['index'] ?? 0);
      this.cacheService.keepAliveData.set(true);
      this._location.back();
    });
  }

  sheetProcedure() {
    // this.pdfService.GenerateIndexCard(this.procedure()!, this.workflow());
    this.parentEmitter.emit();
  }

  get groupProcedure() {
    return GroupProcedure;
  }
}
