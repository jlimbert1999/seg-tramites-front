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
import { forkJoin, switchMap, tap } from 'rxjs';
import {
  ExternalDetailComponent,
  GraphWorkflowComponent,
  InternalDetailComponent,
  ListObservationsComponent,
  ListWorkflowComponent,
} from '../../../../components';
import {
  Communication,
  ExternalProcedure,
  GroupProcedure,
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
import {
  observationResponse,
  transferDetails,
} from '../../../../../infraestructure/interfaces';
import { ProcedureDispatcherComponent } from '../procedure-dispatcher/procedure-dispatcher.component';
import { MatDialog } from '@angular/material/dialog';
import { InboxComponent } from '../inbox.component';

type Procedure = ExternalProcedure | InternalProcedure;

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
    GraphWorkflowComponent,
    ListWorkflowComponent,
    ListObservationsComponent,
  ],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailComponent implements OnInit {
  private _location = inject(Location);
  private inboxService = inject(InboxService);
  private cacheService: CacheService<any> = inject(CacheService);
  private alertService = inject(AlertService);
  private activateRoute = inject(ActivatedRoute);
  private procedureService = inject(ProcedureService);
  private dialog = inject(MatDialog);

  public mail = signal<Communication | null>(null);
  public procedure = signal<Procedure | null>(null);
  public workflow = signal<Workflow[]>([]);
  public observations = signal<observationResponse[]>([]);

  ngOnInit(): void {
    this.activateRoute.params.subscribe(({ id }) => {
      this.inboxService
        .getMail(id)
        .pipe(
          tap((detail) => this.mail.set(detail)),
          switchMap(({ procedure }) =>
            this.getDetail(procedure._id, procedure.group)
          )
        )
        .subscribe((data) => {
          this.procedure.set(data[0]);
          this.workflow.set(data[1]);
          this.observations.set(data[2]);
        });
    });
  }

  getDetail(id_procedure: string, group: GroupProcedure) {
    return forkJoin([
      this.procedureService.getDetail(id_procedure, group),
      this.procedureService.getWorkflow(id_procedure),
      this.procedureService.getObservations(id_procedure),
    ]);
  }

  accept() {
    this.alertService.QuestionAlert({
      title: `¿Aceptar tramite ${this.detail.procedure.code}?`,
      text: 'Solo debe aceptar tramites que haya recibido en fisico',
      callback: () => {
        this.inboxService.accept(this.detail._id).subscribe(() => {
          const { status, ...props } = this.mail()!;
          this.updateMailCache();
          this.mail.set(
            new Communication({ ...props, status: StatusMail.Received })
          );
        });
      },
    });
  }

  reject() {
    this.alertService.ConfirmAlert({
      title: `¿Rechazar tramite ${this.detail.procedure.code}?`,
      text: 'El tramite sera devuelto al funcionario emisor',
      callback: (descripion) => {
        this.inboxService.reject(this.detail._id, descripion).subscribe(() => {
          this.removeMailCache();
          this.backLocation();
        });
      },
    });
  }

  send() {
    const detail: transferDetails = {
      id_mail: this.detail._id,
      code: this.detail.procedure.code,
      id_procedure: this.detail.procedure._id,
      attachmentQuantity: this.detail.attachmentQuantity,
    };
    const dialogRef = this.dialog.open(ProcedureDispatcherComponent, {
      width: '1200px',
      data: detail,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.removeMailCache();
      this.backLocation();
    });
  }

  addObservation() {
    this.alertService.ConfirmAlert({
      title: `¿Observar el tramite: ${this.procedure()!.code}?`,
      text: 'El tramite se mostrara como "OBSERVADO" hasta que usted marque como corregida la observacion',
      callback: (descripion) => {
        this.procedureService
          .addObservation(this.procedure()!._id, descripion)
          .subscribe((obs) => {
            this.observations.update((values) => [obs, ...values]);
          });
      },
    });
  }

  solveObservation(id_observation: string) {
    this.alertService.QuestionAlert({
      title: '¿Marcar la observacion como corregida?',
      text: 'Si todas las observaciones son corregidas el tramite dejara de estar "OBSERVADO"',
      callback: () => {
        this.procedureService
          .solveObservation(id_observation)
          .subscribe((resp) => {
            this.procedure.update((values) => {
              values!.state = resp.state;
              return values;
            });
            this.observations.update((values) => {
              const index = values.findIndex((el) => el._id === id_observation);
              values[index].isSolved = true;
              return [...values];
            });
          });
      },
    });
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

  get detail() {
    return this.mail()!;
  }



  set inboxCache(data: any) {
    // this.cacheService.storage[InboxComponent.name] = data;
  }

  private removeMailCache() {
    // if (this.inboxCache) {
    //   this.inboxCache.datasize = this.inboxCache.datasize -= 1;
    //   this.inboxCache.datasource = this.inboxCache.datasource.filter(
    //     (el) => el._id !== this.detail._id
    //   );
    // }
  }
  private updateMailCache() {
    // if (this.inboxCache) {
    //   const index = this.inboxCache.datasource.findIndex(
    //     (el) => el._id === this.detail._id
    //   );
    //   this.inboxCache.datasource[index].status = StatusMail.Received;
    // }
  }
}
