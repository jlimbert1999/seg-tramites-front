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
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DependencyService } from '../services/dependency.service';
import { ServerSelectSearchComponent } from '../../../components/server-select-search/server-select-search.component';
import { dependencyResponse } from '../../../../infraestructure/interfaces';

interface SelectOptions {
  text: string;
  value: string;
}
@Component({
  selector: 'app-dependency',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ServerSelectSearchComponent,
  ],
  templateUrl: './dependency.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependencyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DependencyComponent>);
  private dependencyService = inject(DependencyService);
  private dependency?: dependencyResponse = inject(MAT_DIALOG_DATA);

  public institutions = signal<{ value: string; text: string }[]>([]);
  public FormDependency: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    codigo: ['', Validators.required],
    sigla: ['', [Validators.required, Validators.maxLength(10)]],
    institucion: ['', Validators.required],
  });

  public options = signal<SelectOptions[]>([]);
  public filteredOptions = signal<SelectOptions[]>([]);

  ngOnInit(): void {
    if (this.dependency) {
      this.FormDependency.removeControl('institucion');
      const { institucion, ...values } = this.dependency;
      this.FormDependency.patchValue(values);
    } else {
      this.getInstitutions();
    }
  }

  getInstitutions() {
    this.dependencyService.getInstitutions().subscribe((resp) => {
      this.options.set(resp.map((el) => ({ value: el._id, text: el.nombre })));
      this.filteredOptions.set(this.options());
    });
  }

  filterInstitutions(term: string) {
    this.filteredOptions.set(
      this.options().filter((op) => op.text.toLowerCase().indexOf(term!) > -1)
    );
  }

  selectInstitution(id?: string) {
    this.FormDependency.get('institucion')?.setValue(id ?? '');
  }

  save() {
    const subscription = this.dependency
      ? this.dependencyService.edit(
          this.dependency._id,
          this.FormDependency.value
        )
      : this.dependencyService.add(this.FormDependency.value);
    subscription.subscribe((resp) => {
      this.dialogRef.close(resp);
    });
  }
}
