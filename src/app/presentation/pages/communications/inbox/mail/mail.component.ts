import { CommonModule, Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { forkJoin, switchMap } from 'rxjs';
import {
  ExternalDetailComponent,
  InternalDetailComponent,
  DispatcherComponent,
} from '../../../../components';
import {
  Communication,
  StateProcedure,
  StatusMail,
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
import { MaterialModule } from '../../../../../material.module';
import { InboxCache } from '../inbox.component';

@Component({
  selector: 'app-mail',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ExternalDetailComponent,
    InternalDetailComponent,
  ],
  templateUrl: './mail.component.html',
  styleUrl: './mail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private _location = inject(Location);
  private dialog = inject(MatDialog);

  private inboxService = inject(InboxService);
  private archiveService = inject(ArchiveService);
  private procedureService = inject(ProcedureService);

  private cacheService: CacheService<InboxCache> = inject(CacheService);
  private alertService = inject(AlertService);
  private pdfService = inject(PdfService);

  mail = signal<Communication | null>(null);

  constructor() {}

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap(({ id }) => this.inboxService.getMail(id)))
      .subscribe((resp) => {
        this.mail.set(resp);
      });
  }

  accept() {
    this.alertService.QuestionAlert({
      title: `¿Aceptar tramite ${this.detail.procedure.code}?`,
      text: 'Solo debe aceptar tramites que haya recibido en fisico',
      callback: () => {
        this.inboxService.accept(this.detail._id).subscribe((resp) => {
          const { procedure } = this.detail;
          procedure.state = resp.state;
          this.mail.set(
            this.detail.copyWith({
              status: StatusMail.Received,
              procedure: procedure,
            })
          );
          this.updateElementCache();
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
          this.removeElementCache();
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
    const dialogRef = this.dialog.open(DispatcherComponent, {
      width: '1200px',
      data: detail,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.removeElementCache();
      this.backLocation();
    });
  }

  archive(state: StateProcedure.Concluido | StateProcedure.Suspendido) {
    this.alertService.ConfirmAlert({
      title: `¿${
        state === StateProcedure.Concluido ? 'Concluir' : 'Suspender'
      } el tramite ${this.detail.procedure.code}?`,
      text: 'El tramite pasara a su seccion de archivos',
      callback: (description) => {
        this.archiveService
          .create(this.detail._id, description, state)
          .subscribe(() => {
            this.removeElementCache();
            this.backLocation();
          });
      },
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

  generateRouteMap() {
    forkJoin([
      this.procedureService.getDetail(
        this.detail.procedure._id,
        this.detail.procedure.group
      ),
      this.procedureService.getWorkflow(this.detail.procedure._id),
    ]).subscribe(([procedure, workflow]) => {
      this.pdfService.generateRouteSheet(procedure, workflow);
    });
  }

  handleStateChange(state: StateProcedure) {
    const { procedure, ...props } = this.detail;
    procedure.state = state;
    this.mail.set(new Communication({ ...props, procedure }));
  }

  private removeElementCache(): void {
    const cache = this.cacheService.load('inbox');
    if (!cache) return;
    const { datasource, datasize, ...props } = cache;
    this.cacheService.save('inbox', {
      ...props,
      datasize: datasize - 1,
      datasource: datasource.filter((el) => el._id !== this.detail._id),
    });
  }

  private updateElementCache(): void {
    const cache = this.cacheService.load('inbox');
    if (!cache) return;
    const { datasource, ...props } = cache;
    const index = datasource.findIndex((el) => el._id === this.detail._id);
    datasource[index] = this.detail;
    this.cacheService.save('inbox', { ...props, datasource });
  }

  get detail() {
    return this.mail()!;
  }

  get StateProcedure() {
    return StateProcedure;
  }
}
