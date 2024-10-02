import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { ServerSelectSearchComponent } from '../../../../../shared';
import { OfficerService } from '../../../services';
import { Officer } from '../../../../domain';

@Component({
  selector: 'app-officer-dialog',
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
  templateUrl: './officer-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficerDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef);
  private officerService = inject(OfficerService);

  public data: Officer = inject(MAT_DIALOG_DATA);
  public FormOfficer: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    paterno: ['', Validators.required],
    materno: [''],
    dni: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(8)],
    ],
    telefono: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(8)],
    ],
  });

  ngOnInit(): void {
    this.FormOfficer.patchValue(this.data);
  }

  save() {
    const subscription = this.data
      ? this.officerService.update(this.data._id, this.FormOfficer.value)
      : this.officerService.create(this.FormOfficer.value);
    subscription.subscribe((officer) => {
      this.dialogRef.close(officer);
    });
  }
}
