import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { switchMap } from 'rxjs';
import {
  ExternalDetailComponent,
  InternalDetailComponent,
} from '../../../../components';
import {
  Communication,
  ExternalProcedure,
  InternalProcedure,
} from '../../../../../domain/models';
import {
  CacheService,
  InboxService,
  ProcedureService,
} from '../../../../services';

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    ExternalDetailComponent,
    InternalDetailComponent,
  ],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailComponent {
  private _location = inject(Location);
  private inboxService = inject(InboxService);
  private activateRoute = inject(ActivatedRoute);
  private cacheService = inject(CacheService);
  private procedureService = inject(ProcedureService);

  public mail = signal<Communication | undefined>(undefined);
  public data = toSignal(
    this.activateRoute.params.pipe(
      switchMap(({ id }) => this.inboxService.getMailDetails(id)),
      switchMap((data) => {
        this.mail.set(data);
        return this.procedureService.getProcedureDetail(
          data.procedure._id,
          data.procedure.group
        );
      })
    )
  );

  public procedure = computed(() => this.data()?.procedure);
  public workflow = computed(() => this.data()?.workflow);

  accept() {}
  reject() {}

  backLocation() {
    this.activateRoute.queryParams.subscribe((data) => {
      this.cacheService.pageSize.set(data['limit'] ?? 10);
      this.cacheService.pageIndex.set(data['index'] ?? 0);
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
