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
import { GroupProcedure } from '../../../../domain/models';
import {
  ExternalDetailComponent,
  InternalDetailComponent,
} from '../../../components';
import { CacheService } from '../../../services';
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
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailComponent implements OnInit {
  private _location = inject(Location);
  private route = inject(ActivatedRoute);
  private cacheService = inject(CacheService);

  public properties = signal<procedureProps | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe(({ id, group }) => {
      this.properties.set({ id, group });
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
