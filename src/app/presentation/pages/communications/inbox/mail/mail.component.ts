import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, tap } from 'rxjs';
import {
  ExternalDetailComponent,
  GraphWorkflowComponent,
  InternalDetailComponent,
  ObservationsComponent,
  ListWorkflowComponent,
} from '../../../../components';
import {
  Communication,
  GroupProcedure,
  StateProcedure,
  StatusMail,
  Workflow,
} from '../../../../../domain/models';
import {
  AlertService,
  ArchiveService,
  CacheService,
  InboxService,
  PdfService,
  ProcedureService,
} from '../../../../services';
import { transferDetails } from '../../../../../infraestructure/interfaces';
import { ProcedureDispatcherComponent } from '../procedure-dispatcher/procedure-dispatcher.component';
import { MaterialModule } from '../../../../../material.module';
import { InboxCache, InboxComponent } from '../inbox.component';

@Component({
  selector: 'app-mail',
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
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailComponent implements OnInit {
  private _location = inject(Location);
  private inboxService = inject(InboxService);
  private cacheService: CacheService<InboxCache> = inject(CacheService);
  private alertService = inject(AlertService);
  private activateRoute = inject(ActivatedRoute);
  private procedureService = inject(ProcedureService);
  private pdfService = inject(PdfService);
  private dialog = inject(MatDialog);
  private archiveService = inject(ArchiveService);

  mail = signal<Communication | null>(null);
  workflow = signal<Workflow[]>([]);
  status = computed(() => this.mail()?.status);

  ngOnInit(): void {
    this.activateRoute.params.subscribe(({ id }) => {
      this.inboxService
        .getMail(id)
        .pipe(
          tap((detail) => {
            this.mail.set(detail);
          }),
          switchMap(({ procedure }) =>
            this.procedureService.getWorkflow(procedure._id)
          )
        )
        .subscribe((worflow) => {
          this.workflow.set(worflow);
        });
    });
  }

  accept() {
    this.alertService.QuestionAlert({
      title: `¿Aceptar tramite ${this.detail.procedure.code}?`,
      text: 'Solo debe aceptar tramites que haya recibido en fisico',
      callback: () => {
        this.inboxService.accept(this.detail._id).subscribe(() => {
          const { status, ...props } = this.mail()!;
          const updated = new Communication({
            ...props,
            status: StatusMail.Received,
          });
          this.mail.set(updated);
          this.updateMailCache(updated);
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

  archive() {
    this.alertService.ConfirmAlert({
      title: `¿Concluir el tramite ${this.detail.procedure.code}?`,
      text: 'Concluir indica que no hay más acciones pendientes',
      callback: (description) => {
        this.archiveService
          .archiveCommunication(this.detail._id, {
            description: description,
            state: StateProcedure.Concluido,
          })
          .subscribe(() => {
            this.removeMailCache();
            this.backLocation();
          });
      },
    });
  }

  suspend() {
    this.alertService.ConfirmAlert({
      title: `¿Suspender el tramite ${this.detail.procedure.code}?`,
      text: 'Suspender detiene temporalmente el proceso',
      callback: (description) => {
        this.archiveService
          .archiveCommunication(this.detail._id, {
            description: description,
            state: StateProcedure.Suspendido,
          })
          .subscribe(() => {
            this.removeMailCache();
            this.backLocation();
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

  generateRouteMap() {
    this.procedureService
      .getDetail(this.detail.procedure._id, this.detail.procedure.group)
      .subscribe((procedure) => {
        this.pdfService.generateRouteSheet(procedure, this.workflow());
      });
  }

  get detail() {
    return this.mail()!;
  }

  get groupProcedure() {
    return GroupProcedure;
  }

  private removeMailCache() {
    const cache = this.cacheService.load(InboxComponent.name);
    if (!cache) return;
    const { datasource, datasize, ...props } = cache;
    this.cacheService.save(InboxComponent.name, {
      ...props,
      datasize: datasize - 1,
      datasource: datasource.filter((el) => el._id !== this.detail._id),
    });
  }

  private updateMailCache(mail: Communication): void {
    const cache = this.cacheService.load(InboxComponent.name);
    if (!cache) return;
    const { datasource, ...props } = cache;
    const index = datasource.findIndex((el) => el._id === this.detail._id);
    datasource[index] = mail;
    this.cacheService.save(InboxComponent.name, { ...props, datasource });
  }
}
