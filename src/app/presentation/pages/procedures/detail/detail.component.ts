import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin, switchMap, tap } from 'rxjs';
import {
  ExternalProcedure,
  GroupProcedure,
  InternalProcedure,
  Procedure,
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
import {
  locationResponse,
  observationResponse,
} from '../../../../infraestructure/interfaces';

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

  public procedure = signal<Procedure | null>(null);
  public location = signal<locationResponse[]>([]);
  public workflow = signal<Workflow[]>([]);
  public observations = signal<observationResponse[]>([]);

  parentEmitter = new EventEmitter<void>();
  group = signal<GroupProcedure | null>(null);

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap(({ group }) => this.group.set(group)),
        switchMap(({ id, group }) => this.getData(id, group))
      )
      .subscribe((data) => {
        this.procedure.set(data[0]);
        this.location.set(data[1]);
        this.workflow.set(data[2]);
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

  private getData(id: string, group: GroupProcedure) {
    return forkJoin([
      this.procedureService.getDetail(id, group),
      this.procedureService.getLocation(id),
      this.procedureService.getWorkflow(id),
    ]);
  }

  get groupProcedure() {
    return GroupProcedure;
  }

  get external() {
    return this.procedure() as ExternalProcedure;
  }

  get internal() {
    return this.procedure() as InternalProcedure;
  }
}
