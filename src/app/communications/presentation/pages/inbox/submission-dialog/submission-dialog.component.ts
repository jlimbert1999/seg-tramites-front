import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  Component,
  OnInit,
  inject,
  signal,
  effect,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  distinctUntilChanged,
  BehaviorSubject,
  Observable,
  switchMap,
  debounce,
  timer,
  map,
} from 'rxjs';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {
  SimpleSelectOption,
  SimpleSelectSearchComponent,
} from '../../../../../shared';
import {
  AlertService,
  InboxService,
  recipient,
  onlineAccount,
  SocketService,
} from '../../../../../presentation/services';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
    ReactiveFormsModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinner,
    NgxMatSelectSearchModule,
    SimpleSelectSearchComponent,
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

  data: TransferDetails = inject(MAT_DIALOG_DATA);
  institutions = signal<SimpleSelectOption<string>[]>([]);
  dependencies = signal<SimpleSelectOption<string>[]>([]);

  FormEnvio: FormGroup = this.fb.group({
    reference: ['PARA SU ATENCION', Validators.required],
    attachmentsCount: [this.data.attachmentsCount, Validators.required],
    internalNumber: [''],
  });

  accounts = signal<onlineAccount[]>([]);
  recipients = signal<recipient[]>([]);
  dependencyId = signal<string | null>(null);
  isFormPosting = signal<boolean>(false);

  public filterReceiverCtrl = new FormControl<string>('');
  public bankServerSideCtrl = new FormControl<onlineAccount | null>(null);
  public filteredReceivers$ = new BehaviorSubject<onlineAccount[]>([]);

  constructor() {
    effect(() => {
      this.filteredReceivers$.next(this.accounts());
    });
  }

  ngOnInit(): void {
    this._getRequiredProps();
    this._setFilterControl();
  }

  showConfirmSend(): void {
    this.alertService
      .confirmDialog({
        title: `¿Confirmar Remision?`,
        description: `Se remitira el tramite ${this.data.code}`,
      })
      .subscribe((result) => {
        if (result) {
          this.send();
        }
      });
  }

  send(): void {
    this.isFormPosting.set(true);
    this.inboxService
      .create({
        form: this.FormEnvio.value,
        mailId: this.data.mailId,
        procedureId: this.data.procedureId,
        recipients: this.recipients(),
      })
      .subscribe(() => {
        this.dialogRef.close(true);
        this.isFormPosting.set(false);
      });
  }

  getDependencies(institutionId: string) {
    this.accounts.set([]);
    this.inboxService
      .getDependenciesInInstitution(institutionId)
      .subscribe((data) => {
        this.dependencies.set(
          data.map(({ _id, nombre }) => ({ value: _id, text: nombre }))
        );
      });
  }

  getRecipientsByDependency(dependencyId: string): void {
    this.dependencyId.set(dependencyId);
    this.inboxService
      .searchRecipients(dependencyId)
      .pipe(switchMap((receivers) => this._checkOnlineAccounts(receivers)))
      .subscribe((accounts) => this.accounts.set(accounts));
  }

  add(type: 'original' | 'copy'): void {
    const receiver = this.bankServerSideCtrl.value;
    if (!receiver) return;
    if (this.data.isOriginal) {
      if (type === 'original') {
        const hasOriginal = this.recipients().some(
          ({ isOriginal }) => isOriginal
        );
        if (hasOriginal) {
          console.log('ya hay un original');
          return;
        }
      }
      const duplicante = this.recipients().some(
        ({ accountId }) => accountId === receiver.accountId
      );
      if (duplicante) {
        console.log('receptor duplicadno');
        return;
      }
      this.recipients.update((values) => [
        ...values,
        {
          accountId: receiver.accountId,
          jobtitle: receiver.jobtitle,
          fullname: receiver.officer.fullname,
          isOriginal: type === 'original' ? true : false,
        },
      ]);
    } else {
      if (type === 'original') {
        console.log('no se puede derivar el original con una copia');
        return;
      }
      const { officer, jobtitle, accountId } = receiver;
      this.recipients.set([
        { fullname: officer.fullname, jobtitle, accountId, isOriginal: false },
      ]);
    }
    this.bankServerSideCtrl.setValue(null);
  }

  remove(id: string): void {
    this.recipients.update((values) =>
      values.filter((el) => el.accountId !== id)
    );
  }

  get isValidForm(): boolean {
    if (this.data.isOriginal) {
      return (
        this.FormEnvio.valid &&
        this.recipients().some(({ isOriginal }) => isOriginal)
      );
    }
    return this.FormEnvio.valid && this.recipients().length > 0;
  }

  private _getRequiredProps(): void {
    this.inboxService.getInstitucions().subscribe((resp) => {
      const options = resp.map(({ _id, nombre }) => ({
        value: _id,
        text: nombre,
      }));
      this.institutions.set(options);
    });
  }

  private _setFilterControl(): void {
    this.filterReceiverCtrl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        debounce(() => timer(this.dependencyId() ? 0 : 350))
      )
      .subscribe((term) => {
        this._filterRecipients(term);
      });
  }

  private _filterRecipients(term: string | null): void {
    if (!this.dependencyId()) {
      if (!term) return;
      this.inboxService
        .searchRecipients(term)
        .pipe(switchMap((receivers) => this._checkOnlineAccounts(receivers)))
        .subscribe((recipients) => this.accounts.set(recipients));
    } else {
      const options: onlineAccount[] = term
        ? this.accounts().filter(({ officer }) =>
            officer.fullname.toLowerCase().includes(term.toLowerCase())
          )
        : this.accounts();

      this.filteredReceivers$.next(options);
    }
  }

  private _checkOnlineAccounts(
    accounts: onlineAccount[]
  ): Observable<onlineAccount[]> {
    return this.socketService.onlineClients$.pipe(
      takeUntilDestroyed(this.destroyRef),
      map((clients) =>
        accounts.map((receiver) => {
          const isOnline = clients.some(
            ({ userId }) => userId === receiver.accountId
          );
          return { ...receiver, online: isOnline };
        })
      )
    );
  }
}
