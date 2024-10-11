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

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import {
  ServerSelectOption,
  ServerSelectSearchComponent,
  SimpleSelectOption,
  SimpleSelectSearchComponent,
} from '../../../../../shared';
import {
  AccountService,
  AlertService,
  PdfService,
  ReportService,
} from '../../../../../presentation/services';
import { Account, Officer } from '../../../../domain';
import { CustomValidators } from '../../../../../../helpers';
import { filter, pipe, switchMap } from 'rxjs';

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
    MatStepperModule,
    ServerSelectSearchComponent,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './edit-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAccountComponent {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditAccountComponent>);
  private alertService = inject(AlertService);
  private accountService = inject(AccountService);
  private reportService = inject(ReportService);
  private pdfService = inject(PdfService);

  public data = signal(inject<Account>(MAT_DIALOG_DATA));
  public hidePassword = true;

  officers = signal<ServerSelectOption<Officer>[]>([]);
  roles = signal<SimpleSelectOption<string>[]>([]);

  formUser: FormGroup = this.formBuilder.group({
    fullname: [''],
    password: [''],
    login: ['', [Validators.required, CustomValidators.login]],
    role: ['', Validators.required],
    isActive: [true],
  });

  formAccount = this.formBuilder.group({
    jobtitle: ['', Validators.required],
    officer: [''],
    isVisible: [true],
  });

  ngOnInit(): void {
    this._getRequiredProps();
    this._loadForm();
    // TODO get inbox details
  }

  save() {
    const updateTask = this.accountService.edit(
      this.data()._id,
      this.formUser.value,
      this.formAccount.value
    );
    const subscription =
      this.formAccount.get('officer')?.value === null
        ? this.alertService
            .confirmDialog({
              title: '¿Desvincular Funcionario?',
              description: `${this.data().officer?.fullname} sera desvinculado`,
            })
            .pipe(
              filter((result) => result),
              switchMap(() => updateTask)
            )
        : updateTask;
    subscription.subscribe((account) => {
      this.dialogRef.close(account);
    });
  }

  unlink(): void {
    this.formAccount.get('officer')?.setValue(null);
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

  onSelectOfficer(officer: Officer): void {
    const { login, password } = officer.generateCredentials();
    this.formUser.patchValue({
      fullname: officer.fullname,
      login,
      password,
    });
  }

  private _loadForm(): void {
    const { user, officer, ...props } = this.data();
    this.formUser.patchValue(user);
    this.formAccount.patchValue({ ...props, officer: officer?._id });
  }

  private _getRequiredProps(): void {
    this.accountService.getRoles().subscribe((roles) => {
      this.roles.set(
        roles.map(({ _id, name }) => ({ value: _id, text: name }))
      );
    });
  }
}
