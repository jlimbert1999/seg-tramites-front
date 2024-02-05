import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { CacheService, ProcedureService } from '../../../../services';
import {
  ExternalDetailComponent,
  GraphWorkflowComponent,
  InternalDetailComponent,
} from '../../../../components';
import { ExternalProcedure, Workflow } from '../../../../../domain/models';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    ExternalDetailComponent,
    InternalDetailComponent,
    GraphWorkflowComponent,
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private _location = inject(Location);
  private cacheService = inject(CacheService);
  private procedureService = inject(ProcedureService);
  public procedure = signal<ExternalProcedure | undefined>(undefined);
  public workflow = signal<Workflow[]>([]);

  ngOnInit(): void {
    this.route.params.subscribe(({ group, id }) => {
      this.procedureService
        .getProcedureDetail(id, group)
        .subscribe((detail) => {
          this.procedure.set(detail.procedure);
          this.workflow.set(detail.workflow);
        });
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
}
