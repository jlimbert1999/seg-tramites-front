import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { forkJoin, switchMap, tap } from 'rxjs';
import { GroupProcedure, Workflow } from '../../../../domain/models';
import {
  ExternalDetailComponent,
  InternalDetailComponent,
  GraphWorkflowComponent,
  ListWorkflowComponent,
  ObservationsComponent,
} from '../../../components';
import { CacheService, ProcedureService } from '../../../services';
import { MaterialModule } from '../../../../material.module';

type procedureProps = { id: string; group: GroupProcedure };

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

  public properties = signal<procedureProps | undefined>(undefined);
  public workflow = signal<Workflow[]>([]);

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap(({ id, group }) => this.properties.set({ id, group })),
        switchMap(({ id }) => this.getData(id))
      )
      .subscribe((data) => {
        this.workflow.set(data[0]);
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

  private getData(id: string) {
    return forkJoin([
      this.procedureService.getWorkflow(id),
      this.procedureService.getLocation(id),
    ]);
  }
}
