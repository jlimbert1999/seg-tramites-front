import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Account, Officer } from '../../../../../domain/models';
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
import { AccountService, AlertService, PdfService } from '../../../../services';
import { roleResponse } from '../../../../../infraestructure/interfaces';
import { ServerSelectSearchComponent } from '../../../../components';
import { MaterialModule } from '../../../../../material.module';
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
  styles: `.account-settings .user-profile {
    text-align: center;
  }
  
  .account-settings .user-profile .user-avatar {
    margin: 0 0 1rem 0;
  }
  
  .account-settings .user-profile .user-avatar img {
    width: 90px;
    height: 90px;
    border-radius: 100px;
  }
  `,
})
export class EditAccountComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditAccountComponent>);
  private alertService = inject(AlertService);
  private accountService = inject(AccountService);
  private pdfService = inject(PdfService);

  public account = inject<Account>(MAT_DIALOG_DATA);
  public roles = signal<roleResponse[]>([]);
  public updatePassword: boolean = false;
  public officers = signal<SelectOption[]>([]);
  public currentOfficer = signal<Officer | undefined>(undefined);
  public workDetails: { label: string; value: number }[] = [];
  public FormAccount: FormGroup = this.fb.group({
    login: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    rol: ['', Validators.required],
  });

  ngOnInit(): void {
    const { funcionario, ...props } = this.account;
    this.FormAccount.patchValue(props);
    this.currentOfficer.set(funcionario);
    this.accountService.getRoles().subscribe((roles) => this.roles.set(roles));
  }

  unlinkAccount() {
    if (!this.account.funcionario) {
      this.currentOfficer.set(undefined);
      return;
    }
    this.alertService.QuestionAlert({
      title: `¿Desvincular cuenta de ${this.account.fullnameManager()}?`,
      text: `La cuenta quedará deshabilitada hasta que se realice una nueva asignación.`,
      callback: () => {
        this.accountService.unlinkAccount(this.account._id).subscribe(() => {
          delete this.account.funcionario;
          this.currentOfficer.set(undefined);
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
    this.FormAccount.setControl(
      'funcionario',
      new FormControl(officer._id, Validators.required)
    );
    this.currentOfficer.set(officer);
    this.togglePassword(true);
  }
  save() {
    this.accountService
      .edit(this.account._id, this.FormAccount.value)
      .subscribe((account) => {
        const updatedPassword = this.FormAccount.get('password')?.value;
        if (updatedPassword && this.account.funcionario) {
          this.pdfService.createAccountSheet(account, updatedPassword);
        }
        this.dialogRef.close(account);
      });
  }

  togglePassword(value: boolean) {
    this.updatePassword = value;
    if (!value) {
      this.FormAccount.removeControl('password');
      return;
    }
    this.FormAccount.setControl(
      'password',
      new FormControl(this.currentOfficer()?.dni ?? '', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9$]+$/),
      ])
    );
  }
}
