import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';

import { PdfService } from '../../../../../presentation/services';
import { Officer } from '../../../../../domain/models';
import {
  ServerSelectOption,
  ServerSelectSearchComponent,
  SimpleSelectSearchComponent,
} from '../../../../../shared';
import { AccountService } from '../../../services';

@Component({
  selector: 'app-assign-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    SimpleSelectSearchComponent,
    ServerSelectSearchComponent,
  ],
  templateUrl: './assign-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignAccountComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private pdfService = inject(PdfService);
  private dialogRef = inject(MatDialogRef<AssignAccountComponent>);

  hidePassword = true;

  institutions = toSignal(
    this.accountService.getInstitutions().pipe(
      map((resp) =>
        resp.map(({ _id, nombre }) => ({
          value: _id,
          text: nombre,
        }))
      )
    ),
    { initialValue: [] }
  );

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

  dependencies = signal<ServerSelectOption<string>[]>([]);
  officers = signal<ServerSelectOption<Officer>[]>([]);

  FormAccount: FormGroup = this.fb.nonNullable.group({
    fullname: ['', Validators.required],
    login: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\S+$/),
        Validators.minLength(4),
      ],
    ],
    password: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    officer: ['', Validators.required],
    dependency: ['', Validators.required],
    jobtitle: ['', Validators.required],
    role: ['', Validators.required],
  });

  ngOnInit(): void {}

  save() {
    this.accountService.assign(this.FormAccount.value).subscribe((account) => {
      this.pdfService.createAccountSheet(
        account,
        this.FormAccount.get('login')?.value,
        this.FormAccount.get('password')?.value
      );
      this.dialogRef.close(account);
    });
  }

  searchOfficer(term: string): void {
    this.accountService
      .searchOfficersWithoutAccount(term)
      .subscribe((officers) => {
        const options = officers.map((officer) => ({
          text: `${officer.fullname}`,
          value: officer,
        }));
        this.officers.set(options);
      });
  }

  onSelectInstitution(id: string): void {
    this.dependencies.set([]);
    this.accountService.getDependenciesOfInstitution(id).subscribe((data) => {
      const options = data.map(({ _id, nombre }) => ({
        value: _id,
        text: nombre,
      }));
      this.dependencies.set(options);
    });
  }

  onSelectOfficer({
    _id,
    dni,
    nombre,
    paterno,
    materno,
    fullname,
  }: Officer): void {
    const login = nombre.charAt(0) + materno + paterno.charAt(0);
    this.FormAccount.patchValue({
      fullname,
      officer: _id,
      login: login.trim(),
      password: dni.trim(),
    });
  }
}
