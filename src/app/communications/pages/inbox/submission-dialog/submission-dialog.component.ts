import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  ElementRef,
  ViewChild,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  filter,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { MaterialModule } from '../../../../material.module';
import {
  ServerSelectSearchComponent,
  SimpleSelectOption,
  SimpleSelectSearchComponent,
} from '../../../../shared';
import {
  AlertService,
  InboxService,
  receiver,
  SocketService,
} from '../../../../presentation/services';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

export interface TransferDetails {
  mailId?: string;
  procedureId: string;
  code: string;
  attachmentsCount: string;
  isOriginal: boolean;
}

@Component({
  selector: 'submission-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SimpleSelectSearchComponent,
    ServerSelectSearchComponent,
    NgxMatSelectSearchModule,
  ],
  templateUrl: './submission-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmissionDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SubmissionDialogComponent>);
  private destroyRef = inject(DestroyRef);
  private alertService = inject(AlertService);
  private inboxService = inject(InboxService);
  private socketService = inject(SocketService);

  public data: TransferDetails = inject(MAT_DIALOG_DATA);
  public institutions = signal<SimpleSelectOption<string>[]>([]);
  public dependencies = signal<SimpleSelectOption<string>[]>([]);

  public FormEnvio: FormGroup = this.fb.group({
    motivo: ['PARA SU ATENCION', Validators.required],
    cantidad: ['', Validators.required],
    numero_interno: [''],
  });
  public selectedReceivers = signal<receiver[]>([]);

  receivers = signal<receiver[]>([]);
  dependencyId = signal<string | null>(null);

  public filterReceiverCtrl = new FormControl<string>('');
  public filteredReceivers$ = new BehaviorSubject<receiver[]>([]);
  public observable: Observable<receiver[]>;

  public bankServerSideCtrl: FormControl = new FormControl(null);
  term = signal<string>('');

  constructor() {
    // this.filterReceiverCtrl.valueChanges
    //   .pipe(
    //     takeUntilDestroyed(this.destroyRef),
    //     filter((value) => typeof value === 'string')
    //   )
    //   .subscribe((term) => this._filter(term));
  }

  ngOnInit(): void {
    this._getRequiredProps();
    this._filters();
  }

  remove(id: string): void {
    this.selectedReceivers.update((values) =>
      values.filter((el) => el.accountId !== id)
    );
  }

  selected(user: receiver): void {
    // this.fruitInput.nativeElement.value = '';
    // this.filterReceiverCtrl.setValue('');
    // const duplicante = this.selectedReceivers().some(
    //   (el) => el.id_account === user.id_account
    // );
    // if (duplicante) return;
    // this.selectedReceivers.update((values) => [user, ...values]);
  }

  showConfirmSend() {
    this.alertService.QuestionAlert({
      title: `¿Remitir el tramite ${this.data.code}?`,
      text: `Numero de destinatarios: ${this.selectedReceivers().length}`,
      callback: () => {
        this.send();
      },
    });
  }

  send(): void {
    // this.alertService.LoadingAlert(
    //   'Enviando el tramite.....',
    //   'Por favor espere'
    // );
    // this.inboxService
    //   .create(this.FormEnvio.value, this.data, this.selectedReceivers())
    //   .subscribe(() => {
    //     this.alertService.CloseLoadingAlert();
    //     this.dialogRef.close(true);
    //   });
  }

  getDependencies(id_institution: string) {
    this.receivers.set([]);
    this.filteredReceivers$.next([]);
    this.inboxService
      .getDependenciesInInstitution(id_institution)
      .subscribe((data) => {
        this.dependencies.set(
          data.map(({ _id, nombre }) => ({ value: _id, text: nombre }))
        );
      });
  }

  getAccounts(dependencyId: string) {
    this.inboxService
      .searchRecipients(dependencyId)
      // .pipe(switchMap((receivers) => this._checkOnlineClients(receivers)))
      .subscribe((accounts) => {
        console.log(accounts);
        this.dependencyId.set(dependencyId);
        this.receivers.set(accounts);
        this.filteredReceivers$.next(accounts);
      });
  }

  get isValidForm() {
    return this.FormEnvio.valid && this.selectedReceivers().length > 0;
  }

  private _filter(value: string | null): void {
    // if (!value) return this.filteredReceivers$.next(this.receivers());
    // const filtered = this.receivers().filter(
    //   ({ officer: { fullname, jobtitle } }) =>
    //     fullname.toLowerCase().includes(value.toLowerCase()) ||
    //     jobtitle.toLowerCase().includes(value.toLowerCase())
    // );
    // this.filteredReceivers$.next(filtered);
  }

  // private _checkOnlineClients(receivers: receiver[]): Observable<receiver[]> {
  //   return this.socketService.onlineClients$.pipe(
  //     takeUntilDestroyed(this.destroyRef),
  //     map((clients) =>
  //       receivers.map((receiver) => {
  //         const isOnline = clients.some(
  //           ({ userId }) => userId === receiver.id_account
  //         );
  //         return { ...receiver, online: isOnline };
  //       })
  //     )
  //   );
  // }

  private _getRequiredProps(): void {
    this.inboxService.getInstitucions().subscribe((resp) => {
      const options = resp.map(({ _id, nombre }) => ({
        value: _id,
        text: nombre,
      }));
      this.institutions.set(options);
    });
  }

  private _filters() {
    this.filterReceiverCtrl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(this.dependencyId() ? 0 : 350),
        switchMap((term) => this._filterRecipients(term))
      )
      .subscribe((receivers) => {
        this.receivers.set(receivers);
        this.filteredReceivers$.next(receivers);
      });
  }

  private _filterRecipients(term: string | null): Observable<receiver[]> {
    if (!term) return of(this.receivers());
    if (!this.dependencyId()) {
      return this.inboxService.searchRecipients(term);
    }
    const options = this.receivers().filter(
      ({ officer, jobtitle }) =>
        officer.fullname.toLowerCase().includes(term.toLowerCase()) ||
        jobtitle.toLowerCase().includes(term.toLowerCase())
    );
    return of(options);
  }

  set($event: any) {
    console.log($event);
  }
}
