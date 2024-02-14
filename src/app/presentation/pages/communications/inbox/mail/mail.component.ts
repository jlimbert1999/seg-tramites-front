import { CommonModule, Location } from '@angular/common';
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
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import {
  ExternalDetailComponent,
  InternalDetailComponent,
} from '../../../../components';
import {
  Communication,
  ExternalProcedure,
  InternalProcedure,
  StateProcedure,
  StatusMail,
  Workflow,
} from '../../../../../domain/models';
import {
  AlertService,
  CacheService,
  InboxService,
  ProcedureService,
} from '../../../../services';

type Procedure = ExternalProcedure | InternalProcedure;

interface CacheData {
  datasource: Communication[];
  datasize: number;
  text: string;
}
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
export class MailComponent implements OnInit {
  private _location = inject(Location);
  private inboxService = inject(InboxService);
  private cacheService: CacheService<CacheData> = inject(CacheService);
  private activateRoute = inject(ActivatedRoute);
  private procedureService = inject(ProcedureService);
  private alertService = inject(AlertService);

  public mail!: Communication;
  public procedure = signal<Procedure | undefined>(undefined);
  public workflow = signal<Workflow[]>([]);

  ngOnInit(): void {
    this.activateRoute.params.subscribe(({ id }) => {
      this.inboxService
        .getMailDetails(id)
        .pipe(
          switchMap((data) => {
            this.mail = data;
            return this.procedureService.getProcedureDetail(
              data.procedure._id,
              data.procedure.group
            );
          })
        )
        .subscribe((data) => {
          this.procedure.set(data.procedure);
          this.workflow.set(data.workflow);
        });
    });
  }

  accept() {
    // this.procedure.update((values) => {
    //   return { ...values, reference: 'ss' };
    // });
    // this.alertService.QuestionAlert({
    //   title: `¿Aceptar tramite ${this.mail.procedure.code}?`,
    //   text: 'Solo debe aceptar tramites que haya recibido en fisico',
    //   callback: () => {
    //     this.inboxService.accept(this.mail._id).subscribe((resp) => {
    //       this.procedure.update((val) => {
    //         val!.state = resp.state;
    //         return val;
    //       });
    //       this.mail.status = StatusMail.Received;
    //       console.log(this.mail.status);
    //       this.updateElementCache(resp.state);
    //     });
    //   },
    // });
  }

  reject() {
    // this.alertService.ConfirmAlert({
    //   title: `¿Rechazar tramite ${this.mail()!.procedure.code}?`,
    //   text: 'El tramite sera devuelto al funcionario emisor',
    //   callback: (descripion) => {
    //     this.inboxService
    //       .reject(this.mail()!._id, descripion)
    //       .subscribe((resp) => {
    //         this.removeElementCache();
    //         this.backLocation();
    //       });
    //   },
    // });
  }

  backLocation() {
    this.activateRoute.queryParams.subscribe((data) => {
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

  private removeElementCache() {
    // const { datasource } = this.cacheService.storage['_InboxComponent'] ?? {};
    // if (!datasource) return;
    // this.cacheService.storage['_InboxComponent'].datasource = datasource.filter(
    //   (el) => el._id !== this.mail()!._id
    // );
  }

  private updateElementCache(state: StateProcedure) {
    // const { datasource } = this.cacheService.storage['_InboxComponent'] ?? {};
    // if (!datasource) return;
    // const index = datasource.findIndex((el) => el._id === this.mail()!._id);
    // datasource[index].status = StatusMail.Received;
    // datasource[index].procedure.state = state;
    // this.cacheService.storage['_InboxComponent'].datasource = datasource;
  }
}
