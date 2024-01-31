import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-job',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './job.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobComponent {
  private jobService = inject(JobService);
  private job = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  name = new FormControl<string>(
    '',
    { nonNullable: true } && [Validators.required, Validators.minLength(4)]
  );

  ngOnInit(): void {
    if (this.job) {
      this.name.setValue(this.job.nombre);
    }
  }

  save() {
    const supscription = this.job
      ? this.jobService.edit(this.job._id, this.name.value!)
      : this.jobService.add(this.name.value!);
    supscription.subscribe((job) => {
      this.dialogRef.close(job);
    });
  }
}
