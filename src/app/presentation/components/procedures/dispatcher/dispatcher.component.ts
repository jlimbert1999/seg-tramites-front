import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { AlertService, InboxService, SocketService } from '../../../services';
import { SimpleSelectSearchComponent } from '../..';
import {
  transferDetails,
  receiver,
} from '../../../../infraestructure/interfaces';
import { MaterialModule } from '../../../../material.module';

interface SelectOption {
  value: string;
  text: string;
}

@Component({
  selector: 'app-dispatcher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    SimpleSelectSearchComponent,
    MaterialModule,
  ],
  templateUrl: './dispatcher.component.html',
  styleUrl: './dispatcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DispatcherComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DispatcherComponent>);
  private destroyRef = inject(DestroyRef);
  private inboxService = inject(InboxService);
  private socketService = inject(SocketService);
  private alertService = inject(AlertService);

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

  filterReceiverCtrl = new FormControl('');
  filteredFruits = new BehaviorSubject<receiver[]>([]);
  @ViewChild('receiverInput') fruitInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.filterReceiverCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => this._filter(term));
  }

  remove(id: string): void {
    this.selectedReceivers = this.selectedReceivers.filter(
      (el) => el.id_account !== id
    );
  }

  selected(user: receiver): void {
    this.fruitInput.nativeElement.value = '';
    this.filterReceiverCtrl.setValue(null);
    const duplicante = this.selectedReceivers.some(
      (el) => el.id_account === user.id_account
    );
    if (duplicante) return;
    this.selectedReceivers.push(user);
  }

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
    this.inboxService
      .getDependenciesInInstitution(id_institution)
      .subscribe((data) => {
        this.dependencies.set(
          data.map((dep) => ({
            value: dep._id,
            text: dep.nombre,
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
        this.filteredFruits.next(accounts.slice());
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

  get isValidForm() {
    return this.FormEnvio.valid && this.selectedReceivers.length > 0;
  }

  private _filter(value: string | null) {
    console.log(value);
    if (!value) return this.filteredFruits.next(this.receivers());
    const filtered = this.receivers().filter(
      ({ officer: { fullname, jobtitle } }) =>
        fullname.toLowerCase().indexOf(value) > -1 ||
        jobtitle.toLowerCase().indexOf(value) > -1
    );
    this.filteredFruits.next(filtered);
  }
}
