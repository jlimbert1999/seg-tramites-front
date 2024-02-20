import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OfficerService } from '../services/officer.service';
import { Officer } from '../../../../../domain/models';
import { Alert } from '../../../../../helpers';
import { ServerSelectSearchComponent } from '../../../../components';

interface SelectOptions {
  text: string;
  value: job;
}
interface job {
  id: string;
  name: string;
}
@Component({
  selector: 'app-officer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ServerSelectSearchComponent,
  ],
  templateUrl: './officer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficerComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);
  private officerService = inject(OfficerService);

  public officer: Officer = inject(MAT_DIALOG_DATA);
  public currentJobName = signal<string | undefined>(undefined);
  public jobs = signal<SelectOptions[]>([]);
  public FormOfficer: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(6),
        Validators.maxLength(8),
      ],
    ],
    telefono: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(6),
        Validators.maxLength(8),
      ],
    ],
  });

  ngOnInit(): void {
    if (this.officer) {
      const { cargo, ...values } = this.officer;
      this.FormOfficer.patchValue(values);
      if (cargo) {
        this.setJob({ id: cargo._id, name: cargo.nombre });
      }
    }
  }

  save() {
    const subscription = this.officer
      ? this.officerService.edit(this.officer._id, this.FormOfficer.value)
      : this.officerService.add(this.FormOfficer.value);
    subscription.subscribe((officer) => {
      this.dialogRef.close(officer);
    });
  }

  searchJob(value: string) {
    this.officerService.searchJobs(value).subscribe((jobs) => {
      this.jobs.set(
        jobs.map((job) => ({
          value: { name: job.nombre, id: job._id },
          text: job.nombre,
        }))
      );
    });
  }

  setJob(job: job) {
    this.FormOfficer.setControl('cargo', new FormControl(job.id));
    this.currentJobName.set(job.name);
  }

  removeJob() {
    if (this.officer?.cargo) {
      Alert.QuestionAlert(
        `¿Quitar asignacion del cargo ${this.officer.cargo?.nombre}?`,
        `El funcionario ${this.officer.fullname} se mostrara como (SIN CARGO)`,
        () => this.removeAssignedJob()
      );
    } else {
      this.FormOfficer.removeControl('cargo');
      this.currentJobName.set(undefined);
    }
  }

  private removeAssignedJob() {
    this.officerService.removeJob(this.officer?._id!).subscribe(() => {
      this.FormOfficer.removeControl('cargo');
      this.currentJobName.set(undefined);
      delete this.officer.cargo;
    });
  }
  close() {
    this.dialogRef.close(this.officer);
  }
}
