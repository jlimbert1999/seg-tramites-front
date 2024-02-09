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
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountService } from '../services/account.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { AlertService } from '../../../../services';
import { roleResponse } from '../../../../../infraestructure/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
interface SelectOption {
  text: string;
  value: string;
}
@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './edit-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAccountComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditAccountComponent>);
  private alertService = inject(AlertService);
  private accountService = inject(AccountService);

  public account: Account = inject(MAT_DIALOG_DATA);
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
    // this.reportService.getWorkDetails(this.data._id).subscribe((data) => {
    //   this.workDetails = data;
    // });
  }

  unlinkAccount() {
    if (!this.account.funcionario) {
      this.currentOfficer.set(undefined);
      return;
    }
    // this.alertService.QuestionAlert(
    //   {
    //     title: `¿Desvincular cuenta de ${this.account.fullnameManager()}?`,
    //     text:`La cuenta quedará deshabilitada hasta que se realice una nueva asignación.`,
    //     callback:{}
    //   }
    //   () => {
    //     this.accountService.unlinkAccount(this.account._id).subscribe(() => {
    //       delete this.account.funcionario;
    //       this.currentOfficer.set(undefined);
    //     });
    //   }
    // );
  }

  searchOfficer(text: string) {
    // this.accountService.searchOfficersWithoutAccount(text).subscribe((data) => {
    //   this.officers.set(
    //     data.map((officer) => ({ value: officer, text: officer.fullWorkTitle }))
    //   );
    // });
  }

  selectOfficer(officer: Officer) {
    // this.FormAccount.setControl(
    //   'funcionario',
    //   new FormControl(officer._id, Validators.required)
    // );
    // this.currentOfficer.set(officer);
    // this.togglePassword(true);
  }

  save() {
    // this.accountService
    //   .edit(this.data._id, this.FormAccount.value)
    //   .subscribe((account) => {
    //     const updatedPassword = this.FormAccount.get('password')?.value;
    //     if (updatedPassword && this.data.funcionario) {
    //       this.pdfService.createAccountSheet(account, updatedPassword);
    //     }
    //     this.dialogRef.close(account);
    //   });
  }

  togglePassword(value: boolean) {
    // this.updatePassword = value;
    // if (!value) {
    //   this.FormAccount.removeControl('password');
    //   return;
    // }
    // this.FormAccount.setControl(
    //   'password',
    //   new FormControl(this.currentOfficer()?.dni ?? '', [
    //     Validators.required,
    //     Validators.pattern(/^[a-zA-Z0-9$]+$/),
    //   ])
    // );
  }
}
