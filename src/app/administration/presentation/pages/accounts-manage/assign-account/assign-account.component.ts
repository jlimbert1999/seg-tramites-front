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
import { MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { MaterialModule } from '../../../../../material.module';


import { role } from '../../../../../infraestructure/interfaces';
import { Officer } from '../../../../../domain/models';
import { generateCredentials } from '../../../../../helpers';
import { ServerSelectSearchComponent, SimpleSelectSearchComponent } from '../../../../../shared';
import { AccountService } from '../../../services';
import { PdfService } from '../../../../../presentation/services';

interface SelectOption {
  value: string;
  text: string;
}

interface SelectOptionOfficer {
  value: Officer;
  text: string;
}

@Component({
  selector: 'app-assign-account',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
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
  institutions = signal<SelectOption[]>([]);
  dependencies = signal<SelectOption[]>([]);
  officers = signal<SelectOptionOfficer[]>([]);
  roles = signal<role[]>([]);
  FormAccount: FormGroup = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    funcionario: ['', Validators.required],
    dependencia: ['', Validators.required],
    rol: ['', Validators.required],
    login: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\S+$/),
        Validators.minLength(4),
      ],
    ],
  });

  ngOnInit(): void {
    this._getRequiredProps();
  }

  selectInstitution(id: string) {
    this.dependencies.set([]);
    this.accountService.getDependenciesOfInstitution(id).subscribe((data) => {
      this.dependencies.set(
        data.map(({ _id, nombre }) => ({ value: _id, text: nombre }))
      );
    });
  }

  selectOfficer({ nombre, paterno, materno, dni, _id }: Officer) {
    const crendentials = generateCredentials({
      name: nombre,
      middlename: paterno,
      lastname: materno,
      dni: dni,
    });
    this.FormAccount.patchValue({
      funcionario: _id,
      ...crendentials,
    });
  }

  searchOfficers(term: string) {
    this.accountService
      .searchOfficersWithoutAccount(term)
      .subscribe((officers) => {
        this.officers.set(
          officers.map((officer) => ({
            text: `${officer.fullname} (${officer.jobtitle})`,
            value: officer,
          }))
        );
      });
  }

  save() {
    this.accountService.assign(this.FormAccount.value).subscribe((account) => {
      this.pdfService.createAccountSheet(
        account,
        this.FormAccount.get('password')?.value
      );
      this.dialogRef.close(account);
    });
  }

  private _getRequiredProps() {
    forkJoin([
      this.accountService.getInstitutions(),
      this.accountService.getRoles(),
    ]).subscribe(([institutions, roles]) => {
      this.roles.set(roles);
      this.institutions.set(
        institutions.map(({ nombre, _id }) => ({ text: nombre, value: _id }))
      );
    });
  }
}
