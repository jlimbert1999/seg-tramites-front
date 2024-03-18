import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  inject,
  signal,
} from '@angular/core';

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
  ObservationsComponent,
} from '../../../components';
import { CacheService, PdfService, ProcedureService } from '../../../services';
import {
  locationResponse,
  observationResponse,
} from '../../../../infraestructure/interfaces';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ExternalDetailComponent,
    InternalDetailComponent,
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ObservationsComponent,
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

  group = signal<GroupProcedure | null>(null);

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap(({ group }) => this.group.set(group)),
        switchMap(({ id, group }) => this.getData(id, group))
      )
      .subscribe((data) => {
        this.procedure.set(data[0]);
        this.workflow.set(data[1]);
        this.location.set(data[2]);
        this.observations.set(data[3]);
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
  }

  private getData(id: string, group: GroupProcedure) {
    return forkJoin([
      this.procedureService.getDetail(id, group),
      this.procedureService.getWorkflow(id),
      this.procedureService.getLocation(id),
      this.procedureService.getObservations(id),
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
