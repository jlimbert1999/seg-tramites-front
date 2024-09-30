import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { forkJoin } from 'rxjs';

import { role } from '../../../../../infraestructure/interfaces';

import { MaterialModule } from '../../../../../material.module';
import { OfficerService, PdfService } from '../../../../../presentation/services';
import { ServerSelectSearchComponent, SimpleSelectSearchComponent } from '../../../../../shared';
import { AccountService } from '../../../services';


interface SelectOption {
  value: string;
  text: string;
}
@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ServerSelectSearchComponent,
    SimpleSelectSearchComponent,
  ],
  templateUrl: './create-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private officerService = inject(OfficerService);
  private dialogRef = inject(MatDialogRef<CreateAccountComponent>);
  private pdfService = inject(PdfService);

  institutions = signal<SelectOption[]>([]);
  dependencies = signal<SelectOption[]>([]);
  roles = signal<role[]>([]);
  jobs = signal<SelectOption[]>([]);

  hidePassword = true;
  FormOfficer: FormGroup = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
  });
  FormAccount: FormGroup = this.fb.nonNullable.group({
    login: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\S+$/),
        Validators.minLength(4),
      ],
    ],
    password: ['', [Validators.required, Validators.pattern(/^\S+$/)]],
    rol: ['', Validators.required],
    dependencia: ['', Validators.required],
  });

  ngOnInit(): void {
    this.getRequiredProps();
  }

  save() {
    this.accountService
      .create(this.FormAccount.value, this.FormOfficer.value)
      .subscribe((account) => {
        this.pdfService.createAccountSheet(
          account,
          this.FormAccount.get('password')?.value
        );
        this.dialogRef.close(account);
      });
  }

  selectInstitution(id: string) {
    this.dependencies.set([]);
    this.accountService.getDependenciesOfInstitution(id).subscribe((data) => {
      this.dependencies.set(
        data.map(({ _id, nombre }) => ({ value: _id, text: nombre }))
      );
    });
  }

  selectDependency(id: string): void {
    this.FormAccount.get('dependencia')?.setValue(id);
  }

  generateCrendentials() {
    const {
      nombre = '',
      paterno = '',
      materno = '',
      dni = '',
    } = this.FormOfficer.value;
    const login = nombre.charAt(0) + paterno + materno.charAt(0);
    this.FormAccount.get('login')?.setValue(login.trim().toUpperCase());
    this.FormAccount.get('password')?.setValue(dni.trim());
  }

  searchJob(value: string) {
    this.officerService.searchJobs(value).subscribe((jobs) => {
      this.jobs.set(
        jobs.map(({ _id, nombre }) => ({ value: _id, text: nombre }))
      );
    });
  }

  selectJob(id: string | undefined) {
    this.FormOfficer.setControl('cargo', new FormControl(id));
  }

  removeJob() {
    this.FormOfficer.removeControl('cargo');
  }

  private getRequiredProps() {
    forkJoin([
      this.accountService.getRoles(),
      this.accountService.getInstitutions(),
    ]).subscribe(([roles, institutions]) => {
      this.roles.set(roles);
      this.institutions.set(
        institutions.map(({ nombre, _id }) => ({
          value: _id,
          text: nombre,
        }))
      );
    });
  }

  get validForms() {
    return this.FormAccount.valid && this.FormOfficer.valid;
  }
}
