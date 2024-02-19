import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { CacheService, ProcedureService } from '../../../services';
import { observationResponse } from '../../../../infraestructure/interfaces';

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

  public procedure = signal<ExternalProcedure | InternalProcedure | null>(null);
  public workflow = signal<Workflow[]>([]);
  public observations = signal<observationResponse[]>([]);

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap(({ group, id }) => this.getDetail(id, group)))
      .subscribe((data) => {
        this.procedure.set(data[0]);
        this.workflow.set(data[1]);
        this.observations.set(data[2]);
      });
  }

  getDetail(id_procedure: string, group: GroupProcedure) {
    return forkJoin([
      this.procedureService.getDetail(id_procedure, group),
      this.procedureService.getWorkflow(id_procedure),
      this.procedureService.getObservations(id_procedure),
    ]);
  }

  backLocation() {
    this.route.queryParams.subscribe((data) => {
      this.cacheService.pageSize.set(data['limit'] ?? 10);
      this.cacheService.pageIndex.set(data['index'] ?? 0);
      this.cacheService.keepAliveData.set(true);
      this._location.back();
    });
  }

  get external() {
    return this.procedure() as ExternalProcedure;
  }

  get internal() {
    return this.procedure() as InternalProcedure;
  }
}
