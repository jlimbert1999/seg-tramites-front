import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs';
import { CacheService, ProcedureService } from '../../../../services';
import {
  ExternalDetailComponent,
  GraphWorkflowComponent,
  InternalDetailComponent,
  ListWorkflowComponent,
} from '../../../../components';
import type {
  ExternalProcedure,
  InternalProcedure,
} from '../../../../../domain/models';

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
  private data = toSignal(
    this.route.params.pipe(
      switchMap(({ group, id }) =>
        this.procedureService.getProcedureDetail(id, group)
      )
    )
  );
  public procedure = computed(() => this.data()?.procedure);
  public workflow = computed(() => this.data()?.workflow);
  public id_procedure?: string;

  ngOnInit(): void {
    this.route.params.subscribe(({ id }) => {
      this.id_procedure = id;
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

  get external() {
    return this.procedure() as ExternalProcedure;
  }

  get internal() {
    return this.procedure() as InternalProcedure;
  }
}
