import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { groupProcedure } from '../../interfaces';
import { MatButtonModule } from '@angular/material/button';
import { CacheService } from '../../../../services/cache.service';
import { MatTabsModule } from '@angular/material/tabs';
import {
  ExternalDetailComponent,
  InternalDetailComponent,
} from '../../../../components';
import { ProcedureService } from '../../../../services/procedures/procedure.service';
import { ExternalProcedure } from '../../models';

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
  public procedure!: ExternalProcedure;

  ngOnInit(): void {
    this.route.params.subscribe(({ group, id }) => {
      if (!Object.values(groupProcedure).includes(group) || !id) {
        this._location.back();
        return;
      }
      this.procedureService
        .getProcedureDetail(id, group)
        .subscribe((detail) => {
          this.procedure = detail.procedure;
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
