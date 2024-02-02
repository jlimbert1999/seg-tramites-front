import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { SelectSearchComponent } from '../../../components';
import { AccountService } from '../services/account.service';
import { roleResponse } from '../../../../infraestructure/interfaces';
import { OfficerService } from '../../officers/services/officer.service';

interface SelectOption {
  value: string;
  text: string;
}
@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    SelectSearchComponent,
  ],
  templateUrl: './create-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private officerService = inject(OfficerService);
  private dialogRef = inject(MatDialogRef<CreateAccountComponent>);

  institutions = signal<SelectOption[]>([]);
  filteredInstitutions = signal<SelectOption[]>([]);
  dependencies = signal<SelectOption[]>([]);
  filteredDependencies = signal<SelectOption[]>([]);

  jobs = signal<SelectOption[]>([]);
  roles = signal<roleResponse[]>([]);
  hidePassword = true;
  FormOfficer: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
  });
  FormAccount: FormGroup = this.fb.group({
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
    this.getRoles();
  }

  save() {
    this.accountService
      .add(this.FormAccount.value, this.FormOfficer.value)
      .subscribe((account) => {
        // this.pdfService.createAccountSheet(
        //   account,
        //   this.FormAccount.get('password')?.value
        // );
        this.dialogRef.close(account);
      });
  }

  getRoles() {
    this.accountService.getRoles().subscribe((roles) => this.roles.set(roles));
  }

  getInstitutions() {
    this.accountService.getInstitutions().subscribe((data) => {
      this.institutions.set(
        data.map((inst) => ({ text: inst.nombre, value: inst._id }))
      );
    });
  }
  filterInstitutions() {
    // this.filteredDependencies.set(
    //   this.dependencies().filter(
    //     (op) => op.text.toLowerCase().indexOf(term!) > -1
    //   )
    // );
  }

  getDependencies(id_institucion?: string) {
    if (!id_institucion) {
      this.dependencies.set([]);
      this.filteredDependencies.set([]);
      return;
    }
    this.accountService
      .getDependenciesOfInstitution(id_institucion)
      .subscribe((data) => {
        this.dependencies.set(
          data.map((dependency) => ({
            value: dependency._id,
            text: dependency.nombre,
          }))
        );
        this.filteredDependencies.set(this.dependencies());
      });
  }

  filterDependencies(term: string) {
    this.filteredDependencies.set(
      this.dependencies().filter(
        (op) => op.text.toLowerCase().indexOf(term!) > -1
      )
    );
  }

  setDependency(id: string): void {
    this.FormAccount.get('dependencia')?.setValue(id);
  }

  generateCrendentials() {
    const {
      nombre = '',
      paterno = '',
      dni = '',
      materno = '',
    } = this.FormOfficer.value;
    const login = nombre.charAt(0) + paterno + materno.charAt(0);
    this.FormAccount.get('login')?.setValue(login.trim().toUpperCase());
    this.FormAccount.get('password')?.setValue(dni.trim());
  }

  get validForms() {
    return this.FormAccount.valid && this.FormOfficer.valid;
  }

  searchJob(value: string) {
    this.officerService.searchJobs(value).subscribe((jobs) => {
      this.jobs.set(jobs.map((job) => ({ value: job._id, text: job.nombre })));
    });
  }

  setJob(job: { nombre: string; _id: string }) {
    this.FormOfficer.setControl('cargo', job._id);
  }

  removeJob() {
    this.FormOfficer.removeControl('cargo');
  }
}
