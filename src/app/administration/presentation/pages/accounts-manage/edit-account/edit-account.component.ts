import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { filter, map, switchMap, takeWhile } from 'rxjs';

import {
  ServerSelectOption,
  ServerSelectSearchComponent,
  SimpleSelectSearchComponent,
} from '../../../../../shared';
import {
  AccountService,
  AlertService,
  PdfService,
  ReportService,
} from '../../../../../presentation/services';
import { Account, Officer } from '../../../../domain';

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    ServerSelectSearchComponent,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './edit-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAccountComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditAccountComponent>);
  private alertService = inject(AlertService);
  private accountService = inject(AccountService);
  private reportService = inject(ReportService);
  private pdfService = inject(PdfService);

  public data = signal(inject<Account>(MAT_DIALOG_DATA));
  public hidePassword = true;
  public updatePassword = false;
  public officers = signal<ServerSelectOption<Officer>[]>([]);
  public communications = signal<{ label: string; count: number }[]>([]);

  public FormAccount: FormGroup = this.fb.group({
    login: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    password: ['', Validators.pattern(/^\S+$/)],
    role: ['', Validators.required],
    jobtitle: ['', Validators.required],
    isVisible: [true, Validators.required],
    isActive: [true, Validators.required],
    officer: [''],
  });

  roles = toSignal(
    this.accountService.getRoles().pipe(
      map((resp) =>
        resp.map(({ _id, name }) => ({
          value: _id,
          text: name,
        }))
      )
    ),
    { initialValue: [] }
  );

  ngOnInit(): void {
    this._loadForm();
  }

  save() {
    this.accountService
      .edit(this.data()._id, this.FormAccount.value)
      .subscribe((account) => {
        // this.account.set(account as any);
        // const passwordCtrl = this.FormAccount.get('password');
        // if (account.funcionario && passwordCtrl) {
        //   this.pdfService.createAccountSheet(account, '', passwordCtrl?.value);
        // }
        this.dialogRef.close(account);
      });
  }

  unlink() {
    this.alertService
      .confirmDialog({
        title: '¿Desvincular Cuenta?',
        description: 'El funcionario ya no podra crear ni recibir tramites',
      })
      .pipe(
        takeWhile((result) => result),
        switchMap(() => this.accountService.unlink(this.data()._id))
      )
      .subscribe(() => {
        this.data.update((values) => {
          delete values.funcionario;
          return new Account(values);
        });
      });
  }

  searchOfficer(text: string) {
    this.accountService.searchOfficersWithoutAccount(text).subscribe((data) => {
      const options = data.map((officer) => ({
        value: officer,
        text: officer.fullname,
      }));
      this.officers.set(options);
    });
  }

  onSelectOfficer({ _id, dni, nombre, paterno, materno }: Officer): void {
    const login = nombre.charAt(0) + materno + paterno.charAt(0);
    this.FormAccount.patchValue({
      officer: _id,
      login: login.trim(),
      password: dni.trim(),
    });
  }

  close() {
    this.dialogRef.close(this.data());
  }

  private _loadForm() {
    const { user, ...props } = this.data();
    this.FormAccount.patchValue({ ...user, ...props });
  }
}
