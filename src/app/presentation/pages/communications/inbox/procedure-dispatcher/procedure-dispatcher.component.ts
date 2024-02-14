import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { ReplaySubject, map, switchMap } from 'rxjs';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import {
  AlertService,
  InboxService,
  SocketService,
} from '../../../../services';
import { SimpleSelectSearchComponent } from '../../../../components';
import {
  transferDetails,
  receiver,
} from '../../../../../infraestructure/interfaces';

interface SelectOption {
  value: string;
  text: string;
}

@Component({
  selector: 'app-procedure-dispatcher',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './procedure-dispatcher.component.html',
  styleUrl: './procedure-dispatcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcedureDispatcherComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProcedureDispatcherComponent>);
  private destroyRef = inject(DestroyRef);
  private inboxService = inject(InboxService);
  private socketService = inject(SocketService);
  private alertService = inject(AlertService);

  public userCtrl = new FormControl();
  public userFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredUsers: ReplaySubject<receiver[]> = new ReplaySubject<
    receiver[]
  >(1);

  public data: transferDetails = inject(MAT_DIALOG_DATA);
  public institutions = signal<SelectOption[]>([]);
  public dependencies = signal<SelectOption[]>([]);
  public receivers = signal<receiver[]>([]);
  public selectedReceivers: receiver[] = [];
  public FormEnvio: FormGroup = this.fb.group({
    motivo: ['PARA SU ATENCION', Validators.required],
    cantidad: [this.data.attachmentQuantity, Validators.required],
    numero_interno: [''],
  });

  ngOnInit(): void {
    this.getInstitutions();
  }

  showConfirmSend() {
    this.alertService.QuestionAlert({
      title: `¿Remitir el tramite ${this.data.code}?`,
      text: `Numero de destinatarios: ${this.selectedReceivers.length}`,
      callback: () => {
        this.send();
      },
    });
  }

  send(): void {
    this.alertService.LoadingAlert(
      'Enviado el tramite.....',
      'Por favor espere'
    );
    this.inboxService
      .create(this.FormEnvio.value, this.data, this.selectedReceivers)
      .subscribe(() => {
        this.alertService.CloseLoadingAlert();
        this.dialogRef.close(true);
      });
  }

  getInstitutions() {
    this.inboxService.getInstitucions().subscribe((data) => {
      this.institutions.set(
        data.map((inst) => ({ value: inst._id, text: inst.nombre }))
      );
    });
  }

  getDependencies(id_institution: string) {
    this.filteredUsers.next([]);
    this.receivers.set([]);
    this.inboxService
      .getDependenciesInInstitution(id_institution)
      .subscribe((data) => {
        this.dependencies.set(
          data.map((dependency) => ({
            value: dependency._id,
            text: dependency.nombre,
          }))
        );
      });
  }

  getAccounts(id_dependency: string) {
    this.inboxService
      .getAccountsForSend(id_dependency)
      .pipe(switchMap((data) => this.getOnlineUsers(data)))
      .subscribe((accounts) => {
        this.receivers.set(accounts);
        this.filteredUsers.next(this.receivers().slice());
        this.userFilterCtrl.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.filterAccounts();
          });
      });
  }

  private getOnlineUsers(receivers: receiver[]) {
    return this.socketService.onlineUsers$.pipe(
      takeUntilDestroyed(this.destroyRef),
      map((onlineUsers) =>
        receivers.map((account) => ({
          ...account,
          online: onlineUsers.some(
            (user) => user.id_account === account.id_account
          ),
        }))
      )
    );
  }

  addReceiver(account: receiver) {
    this.userCtrl.setValue(null);
    const found = this.selectedReceivers.some(
      (receiver) => receiver.id_account === account.id_account
    );
    if (found) return;
    this.selectedReceivers.push(account);
  }

  removeReceiver(account: receiver) {
    this.selectedReceivers = this.selectedReceivers.filter(
      (receiver) => receiver.id_account !== account.id_account
    );
  }

  private filterAccounts() {
    if (!this.receivers) {
      return;
    }
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.receivers());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUsers.next(
      this.receivers().filter(
        ({ officer }) =>
          officer.fullname.toLowerCase().indexOf(search) > -1 ||
          officer.jobtitle.toLowerCase().indexOf(search) > -1
      )
    );
  }
  get isValidForm() {
    return this.FormEnvio.valid && this.selectedReceivers.length > 0;
  }
}
