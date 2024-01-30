import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
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
import { MatInputModule } from '@angular/material/input';
import { InstitutionService } from '../services/institution.service';
import { institutionResponse } from '../interface/institution-response.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-institution',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './institution.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private institutionService = inject(InstitutionService);
  private dialogRef = inject(MatDialogRef<InstitutionComponent>);
  institution?: institutionResponse = inject(MAT_DIALOG_DATA);
  FormInstitution: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    sigla: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
        Validators.pattern(/^[A-Za-z-]+$/),
      ],
    ],
  });

  ngOnInit(): void {
    this.FormInstitution.patchValue(this.institution ?? {});
  }

  save() {
    const subscription = this.institution
      ? this.institutionService.edit(
          this.institution._id,
          this.FormInstitution.value
        )
      : this.institutionService.add(this.FormInstitution.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }
}
