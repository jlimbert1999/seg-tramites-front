import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
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
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModule } from '../../../../../material.module';
import {
  AccountService,
  AlertService,
  PdfService,
  ReportService,
} from '../../../../services';
import { role } from '../../../../../infraestructure/interfaces';
import { ServerSelectSearchComponent } from '../../../../components';
import { Account, Officer } from '../../../../../domain/models';
import { generateCredentials } from '../../../../../helpers';

interface SelectOption {
  text: string;
  value: Officer;
}

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MaterialModule,
    ServerSelectSearchComponent,
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

  public account = signal(inject<Account>(MAT_DIALOG_DATA));
  public roles = signal<role[]>([]);
  public hidePassword = true;
  public updatePassword = false;
  public officers = signal<SelectOption[]>([]);
  public communications = signal<{ label: string; count: number }[]>([]);
  public FormAccount: FormGroup = this.fb.group({
    login: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    rol: ['', Validators.required],
  });

  ngOnInit(): void {
    const { funcionario, ...props } = this.account();
    this.FormAccount.patchValue(props);
    this.accountService.getRoles().subscribe((roles) => this.roles.set(roles));
    this.reportService.getWorkDetails(this.account()._id).subscribe((data) => {
      this.communications.set(data);
    });
  }

  unlink() {
    this.alertService.QuestionAlert({
      title: `¿ DESVINCULAR CUENTA ?`,
      text: `${
        this.account().funcionario?.fullname
      } perdera el acceso y la cuenta quedará deshabilitada hasta una asignación.`,
      callback: () => {
        this.accountService.unlink(this.account()._id).subscribe(() => {
          this.account.update(
            ({ funcionario, ...props }) => new Account({ ...props })
          );
        });
      },
    });
  }

  searchOfficer(text: string) {
    this.accountService.searchOfficersWithoutAccount(text).subscribe((data) => {
      this.officers.set(
        data.map((officer) => ({
          value: officer,
          text: officer.fullWorkTitle,
        }))
      );
    });
  }

  selectOfficer(officer: Officer) {
    this.updatePassword = true;
    this.hidePassword = false;
    const credentials = generateCredentials({
      name: officer.nombre,
      middlename: officer.paterno,
      lastname: officer.materno,
      dni: officer.dni,
    });
    this.FormAccount.setControl(
      'funcionario',
      new FormControl(officer._id, Validators.required)
    );
    this.password = credentials.password;
    this.FormAccount.patchValue({ ...credentials });
  }

  save() {
    this.accountService
      .edit(this.account()._id, this.FormAccount.value)
      .subscribe((account) => {
        this.account.set(account);
        const passwordCtrl = this.FormAccount.get('password');
        if (account.funcionario && passwordCtrl) {
          this.pdfService.createAccountSheet(account, passwordCtrl?.value);
        }
        this.dialogRef.close(account);
      });
  }
  close() {
    this.dialogRef.close(this.account());
  }

  togglePassword(check: boolean) {
    this.updatePassword = check;
    if (this.updatePassword) {
      this.password = this.account().funcionario?.dni.trim() ?? '000000';
    } else {
      this.FormAccount.removeControl('password');
    }
  }

  private set password(value: string) {
    this.FormAccount.setControl(
      'password',
      new FormControl(value, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9$]+$/),
      ])
    );
  }
}
